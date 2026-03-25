const nameInput = document.getElementById("user-name");
const emailInput = document.getElementById("user-email");
const userstableBody = document.getElementById("users-table-body");
const result = document.getElementById("result");
const saveButton = document.getElementById("save-user");
const clearButton = document.getElementById("clear-user");


function showResult(message, type){
    result.textContent = message;
    result.className = `result ${type}`;
}

function clearForm(){
    nameInput.value = "";
    emailInput.value = "";
}

function renderEmptyTable(message) {
  userstableBody.innerHTML = `
        <tr>
            <td colspan="3" class="user-table-empty">${message}</td>
        </tr>
    `;
}

async function deleteUser(id) {
    showResult("Excluindo registro...", "loading")
  const response = await fetch(`/users/${id}`, { method: "DELETE" });
  if (response.ok) {
    console.log("Usuário deletado:", id);
    showResult("Usuário excluído com sucesso.", "success")
    await loadUsers();
  } else {
    //renderEmptyTable("Problemas ao obter os usuários");
    showResult("Problemas ao excluir o usuário", "error")
  }
}

function renderUsers(users) {
  if (users.length == 0) {
    renderEmptyTable("Nenhum usuário cadastrado.");
  } else {
    let rowsTemp = "";
    for (let i = 0; i < users.length; i++) {
      rowsTemp += `
        <tr>
            <td>${users[i].name}</td>
            <td>${users[i].email}</td>
            <td class="user-table-actions-cell">
            <button class="delete-user-button" onClick="deleteUser(${users[i].id_user})">
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path 
      d="M9 3h6l1 2h4v2H4V5h4l1-2z 
         M6 9h2v8H6V9 
         M10 9h2v8h-2V9 
         M14 9h2v8h-2V9 
         M5 8h14v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8z"
      fill="currentColor">
    </path>
  </svg>
  </button>
</td>
        </tr>
        `;
    }
    userstableBody.innerHTML = rowsTemp;
  }
}

async function loadUsers() {
  const response = await fetch("/users");
  if (response.ok) {
    const users = await response.json();
    renderUsers(users);
  } else {
    renderEmptyTable("Problemas ao obter os usuários");
  }
}

async function createUser(){
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    if(name && email){
    showResult("Salvando usuário...", "loading")
    const response = await fetch(
        `/users`, {
         method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, email})
    });
  if (response.ok) {
        const user = await response.json();
        clearForm();
        showResult("Usuário cadastrado com sucesso.", "success")
        await loadUsers();
    } else {
    //renderEmptyTable("Problemas ao obter os usuários");
    showResult("Problemas ao criar o usuário", "error")
    }
    } else {
        showResult("Preencha nome e e-mail para continuar", "error")
    }
}

saveButton.addEventListener("click", function(){
    createUser();

})

clearButton.addEventListener("click", function(){
    clearForm();

})

loadUsers();
