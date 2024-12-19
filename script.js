document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('talentForm');
    
    // Set minimum date as today for visit date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('visitDate').min = today;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const talent = {
            name: document.getElementById('name').value,
            id: document.getElementById('id').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            visitDate: document.getElementById('visitDate').value,
            pendingSteps: document.getElementById('pendingSteps').value,
            registrationDate: new Date().toISOString()
        };
        
        // Save to localStorage
        let talents = JSON.parse(localStorage.getItem('talents') || '[]');
        talents.push(talent);
        localStorage.setItem('talents', JSON.stringify(talents));
        
        alert('Talent added successfully');
        form.reset();
        searchTalents();
    });
});

function showForm() {
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('dataframeSection').style.display = 'none';
}

function showSearch() {
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('searchSection').style.display = 'block';
    document.getElementById('dataframeSection').style.display = 'none';
    searchTalents();
}

function showDataframe() {
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('dataframeSection').style.display = 'block';
    updateDataframe();
}

function updateDataframe() {
    const talents = JSON.parse(localStorage.getItem('talents') || '[]');
    const tbody = document.getElementById('dataframeBody');
    tbody.innerHTML = '';

    talents.sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate))
          .forEach(talent => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${talent.name}</td>
            <td>${talent.id}</td>
            <td>${talent.phone}</td>
            <td>${talent.email}</td>
            <td>${formatDate(talent.visitDate)}</td>
            <td>${talent.pendingSteps}</td>
            <td>
                <button onclick="deleteTalent('${talent.id}')" class="delete-btn">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function searchTalents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const talents = JSON.parse(localStorage.getItem('talents') || '[]');
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.innerHTML = '';
    
    const filteredTalents = talents.filter(talent => 
        talent.name.toLowerCase().includes(searchTerm) ||
        talent.id.toLowerCase().includes(searchTerm)
    );
    
    if (filteredTalents.length === 0) {
        resultsDiv.innerHTML = '<p class="no-results">No results found</p>';
        return;
    }

    filteredTalents.forEach(talent => {
        const card = document.createElement('div');
        card.className = 'talent-card';
        card.innerHTML = `
            <h3>${talent.name}</h3>
            <p><strong>ID:</strong> ${talent.id}</p>
            <p><strong>Phone:</strong> ${talent.phone}</p>
            <p><strong>Email:</strong> ${talent.email}</p>
            <p><strong>Visit Date:</strong> ${formatDate(talent.visitDate)}</p>
            <p><strong>Pending Steps:</strong></p>
            <p>${talent.pendingSteps}</p>
            <button onclick="deleteTalent('${talent.id}')" class="delete-btn">
                Delete
            </button>
        `;
        resultsDiv.appendChild(card);
    });
}

function deleteTalent(id) {
    if (confirm('Are you sure you want to delete this talent?')) {
        let talents = JSON.parse(localStorage.getItem('talents') || '[]');
        talents = talents.filter(t => t.id !== id);
        localStorage.setItem('talents', JSON.stringify(talents));
        searchTalents();
        updateDataframe();
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}
