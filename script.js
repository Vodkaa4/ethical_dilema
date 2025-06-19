const scenarios = [ 
  { 
    text: "Seorang karyawan menemukan temannya memalsukan data laporan. Apa yang dilakukan?", 
    choices: [ 
      { text: "Melaporkan agar keadilan ditegakkan", icon: "fa-solid fa-balance-scale" }, 
      { text: "Diam demi loyalitas teman", icon: "fa-solid fa-user-friends" }, 
    ], 
  }, 
  { 
    text: "AI harus memilih menyelamatkan 5 orang di rel atau 1 anak kecil di rel lain.", 
    choices: [ 
      { text: "Menyelamatkan 5 orang (Utilitarianisme)", icon: "fa-solid fa-people-group" }, 
      { text: "Menyelamatkan 1 anak kecil (Deontologi)", icon: "fa-solid fa-child" }, 
    ], 
  }, 
  { 
    text: "Dokter bisa mengorbankan 1 pasien sehat untuk menyelamatkan 5 pasien sakit.", 
    choices: [ 
      { text: "Mengorbankan 1 untuk 5 (Konsekuensialis)", icon: "fa-solid fa-hospital-user" }, 
      { text: "Tidak melakukan (Tanggung Jawab Profesi)", icon: "fa-solid fa-handshake" }, 
    ], 
  }, 
  { 
    text: "Pemerintah ingin memata-matai warga demi mencegah terorisme.", 
    choices: [ 
      { text: "Setuju demi keselamatan nasional", icon: "fa-solid fa-shield-halved" }, 
      { text: "Tidak setuju demi privasi & kebebasan", icon: "fa-solid fa-user-secret" }, 
    ], 
  }, 
  { 
    text: "Sistem menolak kandidat dari kelompok minoritas. Apa tindakan?", 
    choices: [ 
      { text: "Biarkan sistem (Efisiensi Bisnis)", icon: "fa-solid fa-gears" }, 
      { text: "Audit & ubah sistem (Anti-Diskriminasi)", icon: "fa-solid fa-scale-balanced" }, 
    ], 
  }, 
]; 

let currentScenario = 0; 
const userChoices = []; 

const scenarioContainer = document.getElementById("scenario-container"); 
const choicesContainer = document.getElementById("choices-container"); 
const nextBtn = document.getElementById("next-btn"); 

// Tambahkan progress bar
const progressBar = document.createElement("div");
progressBar.className = "progress-container";
document.querySelector(".container").insertBefore(
  progressBar,
  document.querySelector("h1").nextSibling
);

function updateProgressBar() {
  const progress = ((currentScenario) / scenarios.length) * 100;
  progressBar.innerHTML = `
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${progress}%"></div>
    </div>
    <div class="progress-text">${currentScenario}/${scenarios.length}</div>
  `;
}

function renderScenario(index) { 
  // Tambahkan animasi loading sebelum menampilkan skenario baru
  scenarioContainer.innerHTML = `
    <div class="loading-dots">
      <span></span><span></span><span></span>
    </div>
  `;
  
  // Delay untuk efek loading
  setTimeout(() => {
    scenarioContainer.classList.remove("fade-in"); 
    void scenarioContainer.offsetWidth; // trigger reflow for animation restart 
    scenarioContainer.classList.add("fade-in"); 

    scenarioContainer.textContent = scenarios[index].text; 

    choicesContainer.innerHTML = ""; 

    scenarios[index].choices.forEach(({ text, icon }, i) => { 
      const btn = document.createElement("button"); 
      btn.classList.add("choice-btn"); 
      btn.classList.add("slide-in");
      btn.style.animationDelay = `${i * 0.2}s`;
      btn.innerHTML = `<i class="${icon}"></i> <span>${text}</span>`; 
      btn.onclick = () => { 
        clearSelection(); 
        btn.classList.add("selected"); 
        // Tambahkan efek suara klik (opsional)
        playSelectSound();
        userChoices[currentScenario] = text; 
        nextBtn.classList.remove("hidden");
        nextBtn.classList.add("pulse-animation");
      }; 
      choicesContainer.appendChild(btn); 
    }); 

    nextBtn.classList.add("hidden");
    updateProgressBar();
  }, 800); // Waktu loading
} 

// Fungsi untuk efek suara (opsional)
function playSelectSound() {
  // Jika ingin menambahkan efek suara
  // const sound = new Audio('click.mp3');
  // sound.play();
}

function clearSelection() { 
  const buttons = choicesContainer.querySelectorAll("button"); 
  buttons.forEach((btn) => btn.classList.remove("selected"));
  nextBtn.classList.remove("pulse-animation");
} 

nextBtn.addEventListener("click", () => { 
  // Tambahkan animasi transisi
  document.querySelector(".container").classList.add("slide-out");
  
  setTimeout(() => {
    document.querySelector(".container").classList.remove("slide-out");
    document.querySelector(".container").classList.add("slide-in");
    
    currentScenario++; 
    if (currentScenario < scenarios.length) { 
      renderScenario(currentScenario); 
      nextBtn.classList.add("hidden"); 
    } else { 
      showFinish(); 
    }
    
    setTimeout(() => {
      document.querySelector(".container").classList.remove("slide-in");
    }, 500);
  }, 300);
}); 

function showFinish() { 
  scenarioContainer.classList.remove("fade-in"); 
  void scenarioContainer.offsetWidth; 
  scenarioContainer.classList.add("fade-in"); 

  // Update progress bar ke 100%
  progressBar.innerHTML = `
    <div class="progress-bar">
      <div class="progress-fill" style="width: 100%"></div>
    </div>
    <div class="progress-text">${scenarios.length}/${scenarios.length}</div>
  `;

  // Tambahkan animasi konfeti untuk perayaan
  createConfetti();

  scenarioContainer.innerHTML = 
    "<h2 class='finish-title'>Terima kasih telah menyelesaikan simulasi dilema etika!</h2>" + 
    "<p class='finish-subtitle'>Anda bisa download hasil pilihan Anda dalam format PDF.</p>"; 

  // Tampilkan hasil pilihan user sebelum download 
  let resultHTML = '<div class="result-list">'; 
  userChoices.forEach((choice, idx) => { 
    resultHTML += ` 
      <div class="result-item fade-in" style="animation-delay: ${idx * 0.2}s"> 
        <p><strong>${idx + 1}. ${scenarios[idx].text}</strong></p> 
        <p>Pilihan Anda: <span class="user-choice"><i class="fa-solid fa-check-circle"></i> ${choice}</span></p> 
      </div> 
    `; 
  }); 
  resultHTML += '</div>'; 
  choicesContainer.innerHTML = resultHTML; 

  nextBtn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Download Hasil PDF'; 
  nextBtn.classList.remove("hidden");
  nextBtn.classList.add("download-btn");
  nextBtn.onclick = generatePDF; 
} 

// Fungsi untuk membuat efek konfeti
function createConfetti() {
  const confettiContainer = document.createElement("div");
  confettiContainer.className = "confetti-container";
  document.body.appendChild(confettiContainer);
  
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDelay = Math.random() * 5 + "s";
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confettiContainer.appendChild(confetti);
  }
  
  // Hapus konfeti setelah animasi selesai
  setTimeout(() => {
    confettiContainer.remove();
  }, 10000);
}

function generatePDF() { 
  // Tambahkan animasi loading saat generate PDF
  nextBtn.innerHTML = `
    <div class="loading-dots">
      <span></span><span></span><span></span>
    </div>
    Menyiapkan PDF...
  `;
  nextBtn.disabled = true;
  
  setTimeout(() => {
    const { jsPDF } = window.jspdf; 
    const doc = new jsPDF(); 

    // Tambahkan header yang lebih menarik
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 210, 30, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Hasil Simulasi Dilema Etika", 105, 15, { align: "center" });
    
    // Tambahkan tanggal
    const today = new Date();
    const dateStr = today.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(`Tanggal: ${dateStr}`, 14, 40);
    
    // Tambahkan hasil pilihan dengan format yang lebih baik
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Ringkasan Pilihan Anda:", 14, 50);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    userChoices.forEach((choice, idx) => {
      const scenarioText = scenarios[idx].text;
      const yPos = 65 + idx * 25;
      
      // Tambahkan nomor dan skenario
      doc.setFont("helvetica", "bold");
      doc.text(`${idx + 1}. ${scenarioText}`, 14, yPos);
      
      // Tambahkan pilihan user
      doc.setFont("helvetica", "normal");
      doc.text(`Pilihan Anda: ${choice}`, 20, yPos + 7);
      
      // Tambahkan garis pemisah (kecuali untuk item terakhir)
      if (idx < userChoices.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(14, yPos + 15, 196, yPos + 15);
      }
    });
    
    // Tambahkan footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text("Ethical Dilemma Simulator - Halaman " + i + " dari " + pageCount, 105, 290, { align: "center" });
    }

    doc.save("hasil_dilema_etika.pdf"); 
    
    // Kembalikan tombol ke normal
    nextBtn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Download Hasil PDF';
    nextBtn.disabled = false;
    
    // Tampilkan pesan sukses
    const successMsg = document.createElement("div");
    successMsg.className = "success-message";
    successMsg.innerHTML = '<i class="fa-solid fa-check-circle"></i> PDF berhasil diunduh!';
    document.querySelector(".container").appendChild(successMsg);
    
    setTimeout(() => {
      successMsg.classList.add("fade-out");
      setTimeout(() => {
        successMsg.remove();
      }, 500);
    }, 3000);
  }, 1500);
} 

// Mulai dari skenario pertama 
updateProgressBar();
renderScenario(currentScenario); 