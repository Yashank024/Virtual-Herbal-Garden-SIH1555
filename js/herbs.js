// Herb information database
const herbData = {
    basil: {
        growing: {
            soil: "Well-draining, rich soil with pH 6.0-7.5",
            sunlight: "Full sun, 6-8 hours daily",
            water: "Keep soil consistently moist but not waterlogged",
            temperature: "70-80°F (21-27°C)",
            spacing: "12-18 inches apart",
            harvesting: "Regular pruning encourages bushier growth. Harvest leaves from the top down."
        },
        benefits: [
            "Rich in antioxidants and anti-inflammatory compounds",
            "Supports digestive health",
            "Natural stress reducer",
            "Contains antibacterial properties",
            "Good source of vitamin K, A, and C",
            "May help lower blood sugar levels"
        ]
    },
    mint: {
        growing: {
            soil: "Rich, moist soil with pH 6.0-7.0",
            sunlight: "Partial to full sun",
            water: "Regular watering, keep soil moist",
            temperature: "55-70°F (13-21°C)",
            spacing: "18-24 inches apart",
            harvesting: "Harvest leaves regularly to prevent flowering and maintain flavor"
        },
        benefits: [
            "Aids digestion and reduces bloating",
            "Relieves nausea",
            "Fresh breath and oral health",
            "May help with respiratory issues",
            "Natural cooling properties",
            "Can help relieve headaches"
        ]
    },
    rosemary: {
        growing: {
            soil: "Well-draining, sandy soil with pH 6.0-7.0",
            sunlight: "Full sun, 6-8 hours daily",
            water: "Allow soil to dry between watering",
            temperature: "65-70°F (18-21°C)",
            spacing: "24-36 inches apart",
            harvesting: "Harvest sprigs as needed, but avoid cutting more than 1/3 of the plant"
        },
        benefits: [
            "Improves memory and concentration",
            "Anti-inflammatory properties",
            "Promotes hair growth",
            "Contains antioxidants",
            "May improve digestion",
            "Natural mosquito repellent"
        ]
    }
};

// Function to show growing details
function showDetails(herb) {
    const modal = new bootstrap.Modal(document.getElementById('herbModal'));
    const modalTitle = document.getElementById('herbModalLabel');
    const modalBody = document.getElementById('herbModalBody');
    
    modalTitle.textContent = `Growing Guide: ${herb.charAt(0).toUpperCase() + herb.slice(1)}`;
    
    const growing = herbData[herb].growing;
    modalBody.innerHTML = `
        <div class="growing-guide">
            <div class="requirement">
                <h5>Soil Requirements</h5>
                <p>${growing.soil}</p>
            </div>
            <div class="requirement">
                <h5>Sunlight Needs</h5>
                <p>${growing.sunlight}</p>
            </div>
            <div class="requirement">
                <h5>Watering</h5>
                <p>${growing.water}</p>
            </div>
            <div class="requirement">
                <h5>Temperature</h5>
                <p>${growing.temperature}</p>
            </div>
            <div class="requirement">
                <h5>Spacing</h5>
                <p>${growing.spacing}</p>
            </div>
            <div class="requirement">
                <h5>Harvesting Tips</h5>
                <p>${growing.harvesting}</p>
            </div>
        </div>
    `;
    
    modal.show();
}

// Function to show benefits
function showBenefits(herb) {
    const modal = new bootstrap.Modal(document.getElementById('herbModal'));
    const modalTitle = document.getElementById('herbModalLabel');
    const modalBody = document.getElementById('herbModalBody');
    
    modalTitle.textContent = `Benefits of ${herb.charAt(0).toUpperCase() + herb.slice(1)}`;
    
    const benefits = herbData[herb].benefits;
    modalBody.innerHTML = `
        <div class="benefits-list">
            <ul class="list-group">
                ${benefits.map(benefit => `
                    <li class="list-group-item">
                        <i class="fas fa-check text-primary me-2"></i>
                        ${benefit}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    modal.show();
}
