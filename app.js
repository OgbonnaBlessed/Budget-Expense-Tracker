document.addEventListener('DOMContentLoaded', () => {
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmountInput = document.getElementById('expense-amount');
    const addExpenseButton = document.getElementById('add-expense');
    const expenseList = document.getElementById('expense-list');
    const totalAmountInput = document.getElementById('total-budget');
    const totalBudgetDisplay = document.getElementById('box1-p');
    const totalExpensesDisplay = document.getElementById('box2-p');
    const remainingAmountDisplay = document.getElementById('box3-p');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let expenseId = expenses.length ? expenses[expenses.length - 1].id + 1 : 0;

     let totalAmount = parseFloat(localStorage.getItem('totalAmount')) ||0;
     totalBudgetDisplay.textContent = totalAmount.toFixed(2);
     updateSummary();

    addExpenseButton.addEventListener('click', (event) => {
        event.preventDefault();
        const expenseName = expenseNameInput.value;
        const expenseAmount = parseFloat(expenseAmountInput.value);
        

        if (expenseName && expenseAmount) {
            addExpense(expenseName, expenseAmount);
            expenseNameInput.value = '';
            expenseAmountInput.value = '';
            totalAmountInput.value = '';
        }
    });

    totalAmountInput.addEventListener('change', () => {
        totalAmount = parseFloat(totalAmountInput.value);

        localStorage.setItem('totalAmount', totalAmount);

        totalBudgetDisplay.textContent = totalAmount.toFixed(2);
        updateSummary();
    })

    function addExpense(name, amount) {
        const expense = { id: expenseId++, name, amount };
        expenses.push(expense);

        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
        updateSummary();
    }

    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach(expense => {
            const expenseItem = document.createElement('div');
            expenseItem.className = 'expense-item';
            expenseItem.setAttribute('data-id', expense.id)

            expenseItem.innerHTML = `
            <div class="expense-details">
                <span class="expense-name">${expense.name}</span>
                <span class="expense-amount">${expense.amount}</span>
            </div>
            <div class="expense-actions">
                <button onclick="editExpense(${expense.id})">Edit</button>
                <button onclick="deleteExpense(${expense.id})">Delete</button>
            </div>
            `;

            expenseList.appendChild(expenseItem);
        });
    }

    function updateSummary() {
        const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        const remainingAmount = totalAmount - totalExpenses;

        totalExpensesDisplay.textContent = totalExpenses.toFixed(2);
        remainingAmountDisplay.textContent = remainingAmount.toFixed(2);
    }

    window.editExpense = function (id) {
        const expense = expenses.find(exp => exp.id === id);
        expenseNameInput.value = expense.name;
        expenseAmountInput.value = expense.amount;

        deleteExpense(id);
    }

    window.deleteExpense = function (id) {
        expenses = expenses.filter(exp => exp.id !== id);

        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
        updateSummary();
    }

    renderExpenses();
})