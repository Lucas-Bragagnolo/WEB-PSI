document.addEventListener("DOMContentLoaded", function() {
    const personalInfoSection = document.getElementById("personal-info");
    const paymentInfoSection = document.getElementById("payment-info");
    const bankDetails = document.getElementById("bank-details");
    const nextStepButton = document.querySelector(".next-step");
    const prevStepButton = document.querySelector(".prev-step");
    const paymentMethods = document.querySelectorAll("input[name='payment-method']");
    const progressBar = document.getElementById("progress-bar");

    // Mostrar solo la sección de información personal al cargar
    personalInfoSection.classList.remove("d-none");
    paymentInfoSection.classList.add("d-none");
    bankDetails.classList.add("d-none");

    // Configurar progreso inicial al 50%
    progressBar.style.width = "50%";
    progressBar.innerText = "50%";

    // Avanzar al siguiente paso
    nextStepButton.addEventListener("click", function() {
        personalInfoSection.classList.add("d-none");
        paymentInfoSection.classList.remove("d-none");

        // Actualizar barra de progreso a 100%
        progressBar.style.width = "100%";
        progressBar.innerText = "100%";
    });

    // Volver al paso anterior
    prevStepButton.addEventListener("click", function() {
        paymentInfoSection.classList.add("d-none");
        personalInfoSection.classList.remove("d-none");

        // Regresar barra de progreso a 50%
        progressBar.style.width = "50%";
        progressBar.innerText = "50%";
    });

    // Mostrar los detalles de la transferencia al seleccionar la opción
    paymentMethods.forEach((method) => {
        method.addEventListener("change", function() {
            if (document.getElementById("bank-transfer").checked) {
                bankDetails.classList.remove("d-none");
            } else {
                bankDetails.classList.add("d-none");
            }
        });
    });
});