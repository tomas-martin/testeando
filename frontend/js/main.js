// Actualizar valor del filtro de precio
document.getElementById("precio").addEventListener("input", function() {
    document.getElementById("precio-value").innerText = `$${this.value}`;
  });
  