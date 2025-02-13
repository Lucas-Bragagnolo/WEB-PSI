        // Validación del formulario
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });

        // Función para mostrar/ocultar contraseña
        function togglePassword() {
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            const passwordRegister = document.getElementById('passwordRegister');
            const toggleIcon = document.getElementById('togglePassword');
            const toggleIconR = document.getElementById('togglePasswordR');
            const toggleIconR2 = document.getElementById('togglePasswordR2');
            
            if (password.type === 'password') {
                password.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
                confirmPassword.type = 'text';
                toggleIconR.classList.remove('fa-eye');
                toggleIconR.classList.add('fa-eye-slash');
                passwordRegister.type = 'text';
                toggleIconR2.classList.remove('fa-eye');
                toggleIconR2.classList.add('fa-eye-slash');
            } else {
                password.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
                confirmPassword.type = 'password';
                toggleIconR.classList.remove('fa-eye-slash');
                toggleIconR.classList.add('fa-eye');
                passwordRegister.type = 'password';
                toggleIconR2.classList.remove('fa-eye-slash');
                toggleIconR2.classList.add('fa-eye');
            }
        }

        // Función para alternar entre formularios
        function togglePanels(panelToShow) {
            const loginPanel = document.getElementById('loginPanel');
            const registerPanel = document.getElementById('registerPanel');
            const recoveryPanel = document.getElementById('recoveryPanel');
            
            // Ocultar todos los paneles primero
            [loginPanel, registerPanel, recoveryPanel].forEach(panel => {
                panel.classList.remove('d-block');
                panel.classList.add('d-none');
            });
            
            // Mostrar el panel seleccionado
            if (panelToShow === 'register') {
                registerPanel.classList.remove('d-none');
                registerPanel.classList.add('d-block');
            } else if (panelToShow === 'recovery') {
                recoveryPanel.classList.remove('d-none');
                recoveryPanel.classList.add('d-block');
            } else {
                loginPanel.classList.remove('d-none');
                loginPanel.classList.add('d-block');
            }
        }
        

        // validacion de contraseñas en registro
        function validatePasswords() {
                    const password1 = document.getElementById('registerPassword');
                    const password2 = document.getElementById('confirmPassword');
                    const feedbackDiv = document.getElementById('passwordFeedback');
        
                    if (password1.value !== password2.value) {
                        password2.setCustomValidity('Las contraseñas no coinciden');
                        feedbackDiv.textContent = 'Las contraseñas no coinciden';
                        return false;
                    } else {
                        password2.setCustomValidity('');
                        feedbackDiv.textContent = '';
                        return true;
                    }
        }
        
        // Agregar eventos para validación en tiempo real
      //  document.getElementById('registerPassword').addEventListener('input', validatePasswords);
       // document.getElementById('confirmPassword').addEventListener('input', validatePasswords);
        
        

        //VALIDAR EL USUARIO POR FETCH
        document.getElementById("loginForm").addEventListener("submit", async function (e) {
            e.preventDefault();
            
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
        
            try {
                const response = await fetch("../data/login.json", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
        
                const data = await response.json();
        
                if (response) {
                    sessionStorage.setItem("token", data.token);
                    window.location.href = "plataforma.html";
                } else {
                    alert("Error: " + data.message);
                }
            } catch (error) {
                console.error("Error en login:", error);
            }
        });
        