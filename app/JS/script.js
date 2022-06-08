const API_ENDPOINT = "https://appconsultorio.azurewebsites.net/";

function validar() {
  var usuario = document.getElementById("usuario").value;
  var contraseña = document.getElementById("pass").value;

  if (usuario == "admin" && contraseña == "password") {
    alert("Usuario y Contraseña validos, BUEN DIA!");
    window.location.href = "/HTML/index.html";
  } else {
    alert("Verifique sus credenciales (contraseña o usuario no valido)");
  }
}

const mostrarFecha = () => {
  const fecha = new Date();
  document.getElementById("dia-Actual").innerHTML = `Día: ${fecha.toLocaleDateString("es-MX")}`;
  return fecha;
};

// Llenar lista de pacientes

const cargarDatosPaciente = () => {
  const id_paciente = new URLSearchParams(window.location.search).get(
    "id_paciente"
  );
  const URL = API_ENDPOINT + `/pacientes/${id_paciente}`;

  const formPaciente = Array.from(
    document
      .getElementById("datos-paciente")
      .querySelectorAll("input:not(#btnModificar)")
  );

  fetch(URL)
    .then((res) => {
      return res.json();
    })
    .then((paciente) => {
      formPaciente.forEach((campo) => {
        campo.value = paciente[campo.id];
      });
    });
};

const cargarDatosCita = () => {
  const id_cita = new URLSearchParams(window.location.search).get("id_cita");
  const URL = API_ENDPOINT + `/citas/${id_cita}`;

  popularLista();

  const fecha = document.getElementById("fecha");
  const hora = document.getElementById("hora-cita");
  

  fetch(URL)
    .then((res) => {
      return res.json();
    })
    .then((cita) => {
      fecha.value = cita.fecha;
      hora.value = cita.hora;
    });
};

const popularLista = () => {
  const URL = API_ENDPOINT + "/pacientes/";

  const elementoSelect = document.getElementById("lista-pacientes");

  fetch(URL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.forEach((paciente) => {
        let option = document.createElement("option");

        option.value = paciente.id;
        option.innerHTML = `${paciente.nombre} ${paciente.apaterno}`;

        elementoSelect.appendChild(option);
      });
    }).catch(error => console.log(error));
};

// Main Obtener Citas
const obtenerCitasMain = () => {
  const citasHoy = mostrarFecha();

  const URL = API_ENDPOINT + "/citas/";
  const tabla = document.querySelector(".main-citas");

  fetch(URL)
    .then((data) => {
      return data.json();
    })
    .then((res) => {

        if(res.length === 0){
            noHayCitas(tabla)
        }

        // No es necesario un else debido a que este codigo debajo no se ejecutara si la respuesta esta vacia y tampoco evitara la ejecucion del codigo
        res.forEach((cita) => {
            // https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
            // JS parses dates accordingly to the local date time so the day may or not be one day off, read above
            const fechaCita = new Date(cita.fecha.replace(/-/g, '\/'));
            // Filtrado de tabla -- puede ser de 2 formas, añadiendo la clase display u omitiendo añadir la fila a la tabla si no coincide la fecha de hoy
            // con el supuesto de que es mas viable omitir la creacion de la fila, se optara la segunda opcion
            // tr.style.display = +fechaCita === +citasHoy ? '' : 'none';
            const diff = fechaCita - citasHoy;
            if(diff < 0){
                const tr = tabla.insertRow(-1);

                tr.id = cita.id;
                tr.className = "table-row";
                tr.dataset.fecha = cita.fecha;
        
                const celdaNombre = tr.insertCell(-1);
                const celdaApaterno = tr.insertCell(-1);
                const celdaAmaterno = tr.insertCell(-1);
                const celdaHora = tr.insertCell(-1);
        
                celdaNombre.innerHTML = `${cita.paciente.nombre}`;
                celdaApaterno.innerHTML = `${cita.paciente.apaterno}`;
                celdaAmaterno.innerHTML = `${cita.paciente.amaterno}`;
                celdaHora.innerHTML = cita.hora;
        
                celdaHora.className = "row-data";
                celdaNombre.className = "row-data";
                celdaAmaterno.className = "row-data";
                celdaApaterno.className = "row-data";
        
                // Codigo repetido, posible refactorizacion disponible.
        
                const btnModificar = document.createElement("button");
                btnModificar.innerHTML = "Modificar";
        
                btnModificar.onclick = (e) => {
                window.location.href = `/HTML/modificar-cita.html?id_cita=${cita.id}`;
                };
        
                celdaHora.appendChild(document.createElement("br"));
                celdaHora.appendChild(btnModificar);
        
                const btnConsultarDatos = document.createElement("button");
                btnConsultarDatos.innerText = "Visualizar Datos";
        
                btnConsultarDatos.onclick = () => {
                alert(
                    `Nombre: ${cita.paciente.nombre}\nApellido Paterno: ${cita.paciente.apaterno}\nApellido Materno: ${cita.paciente.amaterno}\nEdad: ${cita.paciente.edad}\nPeso: ${cita.paciente.peso}`
                );
                };
        
                tr.insertCell(-1).appendChild(btnConsultarDatos);
                // tr.style.display = +citasHoy === +fechaCita ? '' : 'none';
            } else {
                noHayCitas(tabla)
            }
        });
        });
};

// Seria convenienten hacer una funcion aparte para cargar citas en la pagina principal. Esta sirve para el apartado de Visualizar Cita
const obtenerCitas = () => {
  const URL = API_ENDPOINT + "/citas/";
  let tabla = document.querySelector(".datos-clientes");

  fetch(URL)
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      res.forEach((cita) => {
        let tr = tabla.insertRow(-1);

        tr.id = cita.id;
        tr.className = "table-row";

        const celdaFecha = tr.insertCell(-1);
        const celdaHora = tr.insertCell(-1);
        const celdaNombre = tr.insertCell(-1);

        celdaFecha.innerHTML = cita.fecha;
        celdaHora.innerHTML = cita.hora;
        celdaNombre.innerHTML = `${cita.paciente.nombre} ${cita.paciente.apaterno}`;
        celdaFecha.className = "row-data";
        celdaHora.className = "row-data";
        celdaNombre.className = "row-data";

        // Codigo repetido, posible refactorizacion disponible.

        const btnModificar = document.createElement("button");
        btnModificar.innerHTML = "Modificar Cita";
        btnModificar.onclick = (e) => {
          // const rowId = e.target.parentNode.parentNode.id;
          window.location.href = `/HTML/modificar-cita.html?id_cita=${cita.id}`;
        };

        const btnEliminar = document.createElement("button");
        btnEliminar.innerHTML = "Eliminar Cita";
        btnEliminar.onclick = (e) => {
            if (confirm(`Desea Eliminar la cita con ID: ${cita.id}`)) {
              eliminarCita(cita.id);
            }
          };

        const celdaAcciones = tr.insertCell(-1);
        celdaAcciones.appendChild(btnModificar);
        celdaAcciones.appendChild(btnEliminar);
      });
    });
};

const obtenerPacientes = () => {
  const URL = API_ENDPOINT + "/pacientes/";

  let tabla = document.querySelector(".datos-clientes");

  fetch(URL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.forEach((paciente) => {
        let tr = tabla.insertRow(-1);
        tr.id = paciente.id;
        tr.className = "table-row";

        for (const key in paciente) {
          let tabCell = tr.insertCell(-1);
          tabCell.innerHTML = paciente[key];
          tabCell.className = "row-data";
        }

        const btnModificar = document.createElement("button");
        btnModificar.innerHTML = "Modificar Datos";

        btnModificar.onclick = (e) => {
          //const rowId = e.target.parentNode.parentNode.id; Buena forma para obtener el id de una fila pero innecesario de momento.
          window.location.href = `/HTML/modificar-datos.html?id_paciente=${paciente.id}`;
        };

        const btnEliminar = document.createElement("button");
        btnEliminar.innerHTML = "Eliminar Paciente";
        btnEliminar.onclick = (e) => {
          if (confirm(`Desea Eliminar al paciente con ID: ${paciente.id}`)) {
            eliminarPaciente(paciente.id);
          }
        };

        const celdaAcciones = tr.insertCell(-1);
        celdaAcciones.appendChild(btnModificar);
        celdaAcciones.appendChild(btnEliminar);
      });
    });
};

// Funciones para registrar
const registrarPaciente = () => {
  const URL = API_ENDPOINT + "/pacientes/";

  const formData = document
    .getElementById("form-nuevo-paciente")
    .querySelectorAll("input:not(#btnRegistrarPaciente)");

  let data = {};

  formData.forEach((field) => {
    data[field.id] = field.value;
  });

  if(!data.email.includes("@")){
    alert(`El correo ${data.email} no tiene un formato valido\n Debe ser de tipo usario@dominio`);
    return;
  }

  fetch(URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => alert(`Paciente con ID ${data.id} registrado exitosamente`))
    .catch(error => alert(error));
};

const registrarCita = () => {
  const URL = API_ENDPOINT + "/citas/";

  const id = document.getElementById("lista-pacientes").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora-cita").value;

  if (id == 0) {
    alert("Por favor, seleccione un paciente");
    return;
  }

  const cita = {
    fecha: fecha,
    hora: hora,
    id_paciente: id,
  };

  fetch(URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cita),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => alert(`Cita con ID ${data.id} registrada correctamente`))
    .catch(error => alert(`Ocurrio un error al registrar \n error: ${error}`));
};

const actualizarPaciente = () => {
  const id_paciente = new URLSearchParams(window.location.search).get(
    "id_paciente"
  );
  const URL = API_ENDPOINT + `/pacientes/${id_paciente}`;

  const formData = document
    .getElementById("datos-paciente")
    .querySelectorAll("input:not(#btnModificar)");

  const data = {};

  formData.forEach((field) => {
    data[field.id] = field.value;
  });

  data.id = id_paciente;

  if(!data.email.includes("@")){
    alert(`El correo ${data.email} no tiene un formato valido\n Debe ser de tipo usario@dominio`);
    return;
  }

  fetch(URL, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => alert(`Registro con ID: ${data.id} actualizado`));
};

const actualizarCita = () => {
  const id_cita = new URLSearchParams(window.location.search).get("id_cita");
  const URL = API_ENDPOINT + `/citas/${id_cita}`;

  const id = document.getElementById("lista-pacientes").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora-cita").value;

  if (id == 0) {
    alert("Por favor, seleccione un paciente");
    return;
  }

  const cita = {
    fecha: fecha,
    hora: hora,
    id_paciente: id,
  };

  fetch(URL, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cita),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => console.log(`Cita con ID: ${data.id} modificada`));
};

const eliminarPaciente = (id_paciente) => {
  const URL = API_ENDPOINT + `/pacientes/${id_paciente}`;

  fetch(URL, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_paciente: id_paciente }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.ok) {
        alert("Paciente Eliminado con Exito");
      }
    });
};

const eliminarCita = (id_cita) => {
    const URL = API_ENDPOINT + `/citas/${id_cita}`;
  
    fetch(URL, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_cita: id_cita }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.ok) {
          alert("Cita Eliminada con Exito");
        }
      });
  };

// Filtrado de tablas
const filtrarFecha = () => {
  document.getElementById("btnRemoverFiltro").removeAttribute("disabled");

  const strFecha = document.getElementById("dtFecha").value;
  const fecha = new Date(strFecha);

  document.getElementById("selectedFecha").innerText =
    document.getElementById("dtFecha").value;

  const filasDatos = document
    .querySelector(".datos-clientes")
    .querySelectorAll(".table-row");

  for (let index = 0; index < filasDatos.length; index++) {
    const fechaCita = new Date(
      filasDatos[index].getElementsByTagName("td")[0].innerText
    ); // Indice cero porque la fecha es el primer elemento

    // usar + en objeto date hace una cohersion a int del objeto. No es la unica forma de comparar pero es la mas util de momento.
    if (+fecha === +fechaCita) {
      filasDatos[index].style.display = "";
    } else {
      filasDatos[index].style.display = "none";
    }
  }
};

const filtrarNombre = () => {
  document.getElementById("btnRemoverFiltro").removeAttribute("disabled");

  const strNombre = document.getElementById("txtBuscar").value;

  console.log(strNombre);

  const filasDatos = document
    .querySelector(".datos-clientes")
    .querySelectorAll(".table-row");


  for (let index = 0; index < filasDatos.length; index++) {
    const nomPaciente =
      filasDatos[index].getElementsByTagName("td")[0].innerText; // Indice cero porque el nombre es el primer elemento

    if (strNombre.toLowerCase() == nomPaciente.toLowerCase()) {
      filasDatos[index].style.display = "";
    } else {
      filasDatos[index].style.display = "none";
    }
  }
};

// Limpiar filtro de fecha
function removerFiltroFecha() {
  const filasDatos = document
    .querySelector(".datos-clientes")
    .querySelectorAll(".table-row");
  filasDatos.forEach((fila) => (fila.style.display = ""));
  document.getElementById("dtFecha").value = "";
  document.getElementById("selectedFecha").innerText = "(Seleccione una fecha)";
  document.getElementById("btnRemoverFiltro").setAttribute("disabled", "");
}

// Limpiar filtro Nombre
function removerFiltroNombre() {
  const filasDatos = document
    .querySelector(".datos-clientes")
    .querySelectorAll(".table-row");
  filasDatos.forEach((fila) => (fila.style.display = ""));
  document.getElementById("txtBuscar").value = "";
  document.getElementById("btnRemoverFiltro").setAttribute("disabled", "");
}

const noHayCitas = (tabla) => {
    const sinCitas = tabla.insertRow(-1).insertCell(-1);
    sinCitas.appendChild(document.createTextNode("NO HAY CITAS PROGRAMADAS!"));
    sinCitas.setAttribute("colspan", "5");
}

//CREACION DE FUNCIONES CON MENSAJES

//Boton Cerrar sesion

function cerrarSesion() {
  alert("Se ha cerrado la sesión con exito !");
}

//Mensaje modificar cita

function ModificarCita() {
  alert("Se ha modificado la cita con exito !");
}

//Modificar datos

function ModificarDatos() {
  alert("Se han modificado los datos con exito !");
}

//Alta paciente

function AltaPaciente() {
  alert("Los datos del paciente se han registrado con exito!");
}

//Alta cita

function AltaCita() {
  alert("Se ha creado una nueva cita con exito!");
}

/*
Recursos para js:
    https://www.geeksforgeeks.org/how-to-send-row-data-when-clicking-button-using-javascript/
    https://sebhastian.com/javascript-create-button/
    https://www.encodedna.com/javascript/populate-json-data-to-html-table-using-javascript.htm
*/
