// Fungsi untuk menghitung BMR menggunakan persamaan Harris-Benedict
function calculateBMR(weight, height, age, gender) {
  // Persamaan Harris-Benedict
  if (gender === "male") {
    return 66.5 + 13.75 * weight + 5.003 * height - 6.755 * age;
  } else {
    return 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
  }
}

// Fungsi untuk menghitung IMT
function calculateBMI(weight, height) {
  // Konversi tinggi dari cm ke m
  const heightInMeters = height / 100;
  // IMT = berat (kg) / (tinggi (m))^2
  return weight / (heightInMeters * heightInMeters);
}

// Fungsi untuk menghitung kebutuhan kalori total
function calculateTotalCalories(bmr, activityFactor, stressFactor) {
  return bmr * activityFactor * stressFactor;
}

// Fungsi untuk menghitung kebutuhan protein
function calculateProteinNeeds(weight) {
  // 0.8-1.2 gram protein per kg berat badan
  return weight * 1.2;
}

// Fungsi untuk menghitung kebutuhan lemak
function calculateFatNeeds(totalCalories) {
  // 20-35% dari total kalori
  return (totalCalories * 0.25) / 9; // 9 kalori per gram lemak
}

// Fungsi untuk menghitung kebutuhan karbohidrat
function calculateCarbNeeds(totalCalories, proteinGrams, fatGrams) {
  // Sisa kalori setelah protein dan lemak
  const remainingCalories = totalCalories - proteinGrams * 4 - fatGrams * 9;
  return remainingCalories / 4; // 4 kalori per gram karbohidrat
}

// Event listener untuk form kalkulator dewasa
document.addEventListener("DOMContentLoaded", function () {
  const calculatorForm = document.getElementById("calculatorForm");
  const resultDiv = document.getElementById("result");

  calculatorForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Ambil nilai dari form
    const name = document.getElementById("name").value;
    const birthDate = new Date(document.getElementById("birthDate").value);
    const checkDate = new Date(document.getElementById("checkDate").value);
    const gender = document.getElementById("gender").value;
    const age = parseFloat(document.getElementById("age").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);
    const activity = parseFloat(document.getElementById("activity").value);
    const stress = parseFloat(document.getElementById("stress").value);

    // Hitung IMT (Indeks Massa Tubuh)
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // Tentukan status gizi berdasarkan IMT
    let nutritionalStatus = "";
    let statusClass = "";
    if (bmi < 18.5) {
      nutritionalStatus = "Kurus";
      statusClass = "text-warning";
    } else if (bmi >= 18.5 && bmi < 25) {
      nutritionalStatus = "Normal";
      statusClass = "text-success";
    } else if (bmi >= 25 && bmi < 30) {
      nutritionalStatus = "Gemuk";
      statusClass = "text-warning";
    } else {
      nutritionalStatus = "Obesitas";
      statusClass = "text-danger";
    }

    // Hitung BMR (Basal Metabolic Rate)
    let bmr;
    if (gender === "male") {
      bmr = 66 + 13.7 * weight + 5 * height - 6.8 * age;
    } else {
      bmr = 655 + 9.6 * weight + 1.8 * height - 4.7 * age;
    }

    // Hitung Total Energy Expenditure (TEE)
    const tee = bmr * activity * stress;

    // Hitung kebutuhan protein (1.2-1.5g per kg berat badan)
    const proteinMin = weight * 1.2;
    const proteinMax = weight * 1.5;
    const proteinCalories = ((proteinMin + proteinMax) / 2) * 4; // 4 kalori per gram protein

    // Hitung kebutuhan lemak (20-35% dari total kalori)
    const fatMin = (tee * 0.2) / 9; // 9 kalori per gram lemak
    const fatMax = (tee * 0.35) / 9;

    // Hitung kebutuhan karbohidrat (sisa kalori)
    const carbCalories = tee - proteinCalories - ((fatMin + fatMax) / 2) * 9;
    const carbGrams = carbCalories / 4; // 4 kalori per gram karbohidrat

    // Format tanggal
    const formatDate = (date) => {
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Tampilkan hasil
    resultDiv.innerHTML = `
      <div class="alert alert-success">
        <h4>Hasil Perhitungan Kebutuhan Gizi</h4>
        <hr>
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>Tanggal Lahir:</strong> ${formatDate(birthDate)}</p>
        <p><strong>Tanggal Pengecekan:</strong> ${formatDate(checkDate)}</p>
        <p><strong>Usia:</strong> ${age} tahun</p>
        <hr>
        <h5>Status Gizi:</h5>
        <p><strong>IMT (Indeks Massa Tubuh):</strong> ${bmi.toFixed(2)}</p>
        <p><strong>Status Gizi:</strong> <span class="${statusClass}">${nutritionalStatus}</span></p>
        <div class="alert alert-info mt-2">
          <small>
            <strong>Keterangan Status Gizi:</strong><br>
            - Kurus: IMT < 18.5<br>
            - Normal: IMT 18.5 - 24.9<br>
            - Gemuk: IMT 25 - 29.9<br>
            - Obesitas: IMT ≥ 30
          </small>
        </div>
        <hr>
        <h5>Kebutuhan Energi:</h5>
        <p><strong>BMR (Basal Metabolic Rate):</strong> ${bmr.toFixed(
          2
        )} kalori/hari</p>
        <p><strong>Total Kebutuhan Kalori (TEE):</strong> ${tee.toFixed(
          2
        )} kalori/hari</p>
        <hr>
        <h5>Kebutuhan Makronutrien:</h5>
        <p><strong>Protein:</strong> ${proteinMin.toFixed(
          1
        )} - ${proteinMax.toFixed(1)} gram/hari</p>
        <p><strong>Lemak:</strong> ${fatMin.toFixed(1)} - ${fatMax.toFixed(
      1
    )} gram/hari</p>
        <p><strong>Karbohidrat:</strong> ${carbGrams.toFixed(1)} gram/hari</p>
        <hr>
        <p class="text-muted small">* Perhitungan ini menggunakan rumus Harris-Benedict dan faktor koreksi aktivitas serta stres</p>
      </div>
    `;
  });
});

// Event listener untuk form kalkulator anak
document
  .getElementById("childCalculatorForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();

    // Ambil nilai dari form
    const name = document.getElementById("childName").value;
    const birthDate = new Date(document.getElementById("childBirthDate").value);
    const checkDate = new Date(document.getElementById("childCheckDate").value);
    const gender = document.getElementById("childGender").value;
    const weight = parseFloat(document.getElementById("childWeight").value);
    const height = parseFloat(document.getElementById("childHeight").value);
    const activity = parseFloat(document.getElementById("childActivity").value);
    const growth = parseFloat(document.getElementById("childGrowth").value);

    // Hitung usia dalam bulan
    const ageInMonths = Math.floor(
      (checkDate - birthDate) / (30.44 * 24 * 60 * 60 * 1000)
    );
    const ageInYears = ageInMonths / 12;

    // Hitung BMR untuk anak (menggunakan persamaan yang dimodifikasi)
    let bmr;
    if (ageInMonths < 12) {
      // Untuk bayi < 1 tahun
      bmr = weight * 0.5 + 3;
    } else {
      // Untuk anak > 1 tahun
      bmr = weight * 0.5 + height * 0.1 + 1;
    }

    // Hitung IMT (Indeks Massa Tubuh)
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // Tentukan status gizi berdasarkan IMT dan usia
    let nutritionalStatus = "";
    let statusClass = "";

    if (ageInYears < 5) {
      // Status gizi untuk anak di bawah 5 tahun
      if (bmi < 14) {
        nutritionalStatus = "Gizi Buruk";
        statusClass = "text-danger";
      } else if (bmi >= 14 && bmi < 18) {
        nutritionalStatus = "Gizi Kurang";
        statusClass = "text-warning";
      } else if (bmi >= 18 && bmi < 25) {
        nutritionalStatus = "Gizi Baik";
        statusClass = "text-success";
      } else if (bmi >= 25 && bmi < 30) {
        nutritionalStatus = "Gizi Lebih";
        statusClass = "text-warning";
      } else {
        nutritionalStatus = "Obesitas";
        statusClass = "text-danger";
      }
    } else {
      // Status gizi untuk anak di atas 5 tahun
      if (bmi < 15) {
        nutritionalStatus = "Gizi Buruk";
        statusClass = "text-danger";
      } else if (bmi >= 15 && bmi < 18.5) {
        nutritionalStatus = "Gizi Kurang";
        statusClass = "text-warning";
      } else if (bmi >= 18.5 && bmi < 25) {
        nutritionalStatus = "Gizi Baik";
        statusClass = "text-success";
      } else if (bmi >= 25 && bmi < 30) {
        nutritionalStatus = "Gizi Lebih";
        statusClass = "text-warning";
      } else {
        nutritionalStatus = "Obesitas";
        statusClass = "text-danger";
      }
    }

    // Hitung Total Energy Expenditure (TEE)
    const tee = bmr * activity * growth;

    // Hitung kebutuhan protein (1.5-2g per kg berat badan untuk anak)
    const proteinMin = weight * 1.5;
    const proteinMax = weight * 2;
    const proteinCalories = ((proteinMin + proteinMax) / 2) * 4;

    // Hitung kebutuhan lemak (25-35% dari total kalori untuk anak)
    const fatMin = (tee * 0.25) / 9;
    const fatMax = (tee * 0.35) / 9;

    // Hitung kebutuhan karbohidrat (sisa kalori)
    const carbCalories = tee - proteinCalories - ((fatMin + fatMax) / 2) * 9;
    const carbGrams = carbCalories / 4;

    // Format tanggal
    const formatDate = (date) => {
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Tampilkan hasil
    document.getElementById("childResult").innerHTML = `
    <div class="alert alert-success">
      <h4>Hasil Perhitungan Kebutuhan Gizi</h4>
      <hr>
      <p><strong>Nama Anak:</strong> ${name}</p>
      <p><strong>Tanggal Lahir:</strong> ${formatDate(birthDate)}</p>
      <p><strong>Tanggal Pengecekan:</strong> ${formatDate(checkDate)}</p>
      <p><strong>Usia:</strong> ${ageInMonths} bulan (${ageInYears.toFixed(
      1
    )} tahun)</p>
      <hr>
      <h5>Status Gizi:</h5>
      <p><strong>IMT (Indeks Massa Tubuh):</strong> ${bmi.toFixed(2)}</p>
      <p><strong>Status Gizi:</strong> <span class="${statusClass}">${nutritionalStatus}</span></p>
      <div class="alert alert-info mt-2">
        <small>
          <strong>Keterangan Status Gizi:</strong><br>
          - Gizi Buruk: IMT < ${ageInYears < 5 ? "14" : "15"}<br>
          - Gizi Kurang: IMT ${ageInYears < 5 ? "14 - 17.9" : "15 - 18.4"}<br>
          - Gizi Baik: IMT ${ageInYears < 5 ? "18 - 24.9" : "18.5 - 24.9"}<br>
          - Gizi Lebih: IMT 25 - 29.9<br>
          - Obesitas: IMT ≥ 30
        </small>
      </div>
      <hr>
      <h5>Kebutuhan Energi:</h5>
      <p><strong>BMR (Basal Metabolic Rate):</strong> ${bmr.toFixed(
        2
      )} kalori/hari</p>
      <p><strong>Total Kebutuhan Kalori (TEE):</strong> ${tee.toFixed(
        2
      )} kalori/hari</p>
      <hr>
      <h5>Kebutuhan Makronutrien:</h5>
      <p><strong>Protein:</strong> ${proteinMin.toFixed(
        1
      )} - ${proteinMax.toFixed(1)} gram/hari</p>
      <p><strong>Lemak:</strong> ${fatMin.toFixed(1)} - ${fatMax.toFixed(
      1
    )} gram/hari</p>
      <p><strong>Karbohidrat:</strong> ${carbGrams.toFixed(1)} gram/hari</p>
      <hr>
      <p class="text-muted small">* Perhitungan ini menggunakan rumus khusus untuk anak dan faktor koreksi aktivitas serta pertumbuhan</p>
    </div>
  `;
  });
