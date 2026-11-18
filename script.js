
let monthlyBudget = 50000;
let expenses = [];
let nextId = 1;

function formatMoney(amount) {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES"
    }).format(amount);
}

function calculateTotal() {
    let total = 0;

    for (let expense of expenses) {
        total += expense.amount;
    }

    return total;
}

function updateDashboard() {
    const total = calculateTotal();
    const balance = monthlyBudget - total;

    document.getElementById("budget").textContent =
        formatMoney(monthlyBudget);

    document.getElementById("totalExpenses").textContent =
        formatMoney(total);

    document.getElementById("balance").textContent =
        formatMoney(balance);

    const percentage = (total / monthlyBudget) * 100;

    document.getElementById("percentage").textContent =
        percentage.toFixed(1) + "%";

    const progress = document.getElementById("progressBar");

    progress.style.width = Math.min(percentage, 100) + "%";

    const feedback = document.getElementById("feedback");

    feedback.className = "feedback";

    if (total > monthlyBudget) {
        feedback.textContent =
            "Warning! You have exceeded your budget.";
        feedback.classList.add("danger");
        progress.style.background = "#d93636";

    } else if (total >= monthlyBudget * 0.8) {
        feedback.textContent =
            "Careful! You have used at least 80% of your budget.";
        feedback.classList.add("warning");
        progress.style.background = "#e5a323";

    } else {
        feedback.textContent =
            "Great! You are within your budget.";
        progress.style.background = "#16865d";
    }
}

function displayExpenses() {
    const list = document.getElementById("expenseList");

    list.replaceChildren();

    if (expenses.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = "No expenses recorded yet.";
        list.appendChild(empty);
        return;
    }

    for (let expense of expenses) {
        const item = document.createElement("div");
        item.className = "expense-item";

        const details = document.createElement("div");
        details.className = "expense-details";

        const name = document.createElement("strong");
        name.textContent = expense.name;

        const category = document.createElement("small");
        category.textContent = "Category: " + expense.category;

        const amount = document.createElement("p");
        amount.textContent = formatMoney(expense.amount);

        details.append(name, category, amount);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.dataset.id = expense.id;

        item.append(details, deleteButton);
        list.appendChild(item);
    }
}

document.getElementById("expenseForm")
.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("expenseName").value.trim();
    const category = document.getElementById("category").value;
    const amount = Number(document.getElementById("expenseAmount").value);

    if (!name || !category || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter valid expense details.");
        return;
    }

    expenses.push({
        id: nextId++,
        name: name,
        category: category,
        amount: amount
    });

    displayExpenses();
    updateDashboard();

    this.reset();
});

document.getElementById("budgetForm")
.addEventListener("submit", function(event) {
    event.preventDefault();

    const newBudget = Number(
        document.getElementById("budgetInput").value
    );

    if (!Number.isFinite(newBudget) || newBudget <= 0) {
        alert("Please enter a valid budget.");
        return;
    }

    monthlyBudget = newBudget;

    updateDashboard();
    this.reset();
});

document.getElementById("expenseList")
.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-btn")) {
        const id = Number(event.target.dataset.id);

        expenses = expenses.filter(function(expense) {
            return expense.id !== id;
        });

        displayExpenses();
        updateDashboard();
    }
});

// Initial dashboard display
updateDashboard();
displayExpenses();
