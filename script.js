// Inventory data stored in memory
const inventory = {}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  setupTabNavigation()
  loadInitialData()
})

// Setup tab navigation
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab")

      // Remove active class from all buttons and contents
      tabButtons.forEach((b) => b.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))

      // Add active class to clicked button and corresponding content
      this.classList.add("active")
      document.getElementById(tabName).classList.add("active")
    })
  })
}

// Load initial data (you can replace this with data from an API)
function loadInitialData() {
  // Example: Add some initial items
  // inventory = {
  //     'notebook': { quantidade: 5, preco: 2500.00 },
  //     'mouse': { quantidade: 20, preco: 45.50 }
  // };
  updateStats()
}

// Show message alert
function showMessage(msg, type) {
  const alert = document.getElementById("messageAlert")
  alert.textContent = (type === "success" ? "✔ " : "❌ ") + msg
  alert.className = `message-alert show ${type}`

  setTimeout(() => {
    alert.classList.remove("show")
  }, 3000)
}

// Update stats cards
function updateStats() {
  const totalItems = Object.keys(inventory).length
  const totalUnits = Object.values(inventory).reduce((acc, item) => acc + item.quantidade, 0)
  const totalValue = Object.values(inventory).reduce((acc, item) => acc + item.quantidade * item.preco, 0)
  const lowStockItems = Object.values(inventory).filter((item) => item.quantidade < 10).length
  const avgTicket = totalItems > 0 ? totalValue / totalItems : 0

  document.getElementById("totalItems").textContent = totalItems
  document.getElementById("totalUnits").textContent = totalUnits + " unidades"
  document.getElementById("totalValue").textContent = "R$ " + totalValue.toFixed(2).replace(".", ",")
  document.getElementById("lowStock").textContent = lowStockItems
  document.getElementById("avgTicket").textContent = "R$ " + avgTicket.toFixed(2).replace(".", ",")

  updateInventoryTable()
}

// Add Item
function handleAdicionarItem() {
  const name = document.getElementById("addItemName").value.toLowerCase().trim()
  const qty = Number.parseInt(document.getElementById("addItemQty").value)

  if (!name || !document.getElementById("addItemQty").value || isNaN(qty) || qty < 0) {
    showMessage("Preencha corretamente os campos!", "error")
    return
  }

  if (name in inventory) {
    inventory[name].quantidade += qty
  } else {
    inventory[name] = { quantidade: qty, preco: 0.0 }
  }

  showMessage(`Item '${name}' adicionado/atualizado com sucesso!`, "success")
  document.getElementById("addItemName").value = ""
  document.getElementById("addItemQty").value = ""
  updateStats()
}

// Add Price
function handleAdicionarPreco() {
  const name = document.getElementById("priceItemName").value.toLowerCase().trim()
  const price = Number.parseFloat(document.getElementById("priceValue").value)

  if (!name || !document.getElementById("priceValue").value || isNaN(price)) {
    showMessage("Preencha corretamente os campos!", "error")
    return
  }

  if (!(name in inventory)) {
    showMessage("Item não encontrado!", "error")
    return
  }

  inventory[name].preco = price
  showMessage(`Preço do item '${name}' atualizado com sucesso!`, "success")
  document.getElementById("priceItemName").value = ""
  document.getElementById("priceValue").value = ""
  updateStats()
}

// Remove Item
function handleRemoverItem() {
  const name = document.getElementById("removeItemName").value.toLowerCase().trim()

  if (!name) {
    showMessage("Digite o nome do item!", "error")
    return
  }

  if (!(name in inventory)) {
    showMessage("Item não encontrado!", "error")
    return
  }

  delete inventory[name]
  showMessage(`Item '${name}' removido!`, "success")
  document.getElementById("removeItemName").value = ""
  updateStats()
}

// Update Quantity
function handleAtualizarQuantidade() {
  const name = document.getElementById("updateItemName").value.toLowerCase().trim()
  const qty = Number.parseInt(document.getElementById("updateQty").value)

  if (!name || !document.getElementById("updateQty").value || isNaN(qty) || qty < 0) {
    showMessage("Preencha corretamente os campos!", "error")
    return
  }

  if (!(name in inventory)) {
    showMessage("Item não existe no estoque!", "error")
    return
  }

  inventory[name].quantidade = qty
  showMessage(`Quantidade de '${name}' atualizada!`, "success")
  document.getElementById("updateItemName").value = ""
  document.getElementById("updateQty").value = ""
  updateStats()
}

// Update inventory table
function updateInventoryTable() {
  const tbody = document.getElementById("inventoryBody")

  if (Object.keys(inventory).length === 0) {
    tbody.innerHTML = '<tr class="empty-state"><td colspan="4">Estoque vazio</td></tr>'
    return
  }

  tbody.innerHTML = Object.entries(inventory)
    .map(([item, dados]) => {
      const total = dados.quantidade * dados.preco
      return `
            <tr>
                <td class="item-name">${item}</td>
                <td class="qty-cell">${dados.quantidade}</td>
                <td class="price-cell">R$ ${dados.preco.toFixed(2).replace(".", ",")}</td>
                <td class="total-cell">R$ ${total.toFixed(2).replace(".", ",")}</td>
            </tr>
        `
    })
    .join("")
}
