export async function addCityName() {
    try {
        const res = await fetch("/api/il-adlari")
        const cities = await res.json();
        const select = document.getElementById("citySelect");

        cities.forEach(city => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            select.appendChild(option);
        });
    } catch (err) {
        console.error("İller yüklenemedi:", err);
    }
}

window.addEventListener("DOMContentLoaded", addCityName);