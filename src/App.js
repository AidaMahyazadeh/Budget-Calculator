import './App.css';
import { useState,useEffect } from 'react';
import ExpenseList from './Components/ExpenseList';
import ExpenseForm from './Components/ExpenseForm';
import Alert from './Components/Alert';
import {v4 as uuid} from 'uuid';
// const initialExpenses = [
//   { id: uuid(), charge: "rent", amount: 1600 },
//   { id: uuid(), charge: "car payment", amount: 400 },
//   {
//     id: uuid(),
//     charge: "credit card bill ",
//     amount: 1200
//   }
// ];
const initialExpenses =localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')) : [];

function App() {
 const [expenses,setExpenses] =useState(initialExpenses);
 const [charge,setCharge] =useState('');
 const [amount,setAmount] =useState('');
 const [alert,setAlert] =useState ({show :false});
 const [edit,setEdit] = useState(false);
 const [id,setId] = useState(0);

 useEffect(()=>{
  localStorage.setItem('expenses', JSON.stringify(expenses))
 },[expenses])

 const handleCharge = e => {
  setCharge(e.target.value);
};

const handleAmount = e => {
  let amount = e.target.value;
  if (amount === "") {
    setAmount(amount);
  } else {
    setAmount(parseInt(amount));
  }
};

const handleAlert =({type,text})=>{
  setAlert({show :true ,type,text});
  setTimeout(()=>{
    setAlert({show :false})
  },3000)
}

const handleSubmit = (event)=>{
  event.preventDefault();
  if (charge !== ''&& amount >0){
    if (edit) {
      let tempExpense =expenses.map(item =>{
        return item.id===id ?{...item,charge,amount}  : item
      })
      setExpenses(tempExpense);
      setEdit(false);
      handleAlert({type :'success',text :'item edited.'})

    }else{
      const singleExpense ={id :uuid(),charge,amount}
      setExpenses([...expenses,singleExpense]);
      handleAlert({type :'success',text :'item added.'})
    }
 setAmount('');
 setAmount('');
  }else{
  handleAlert( {type :'danger',text :`charge can't be empty value and amount value has to be greater than zero.`})
  }
}

const clearItems = ()=>{
setExpenses([])
handleAlert({type :'danger',text :'all items deleted.'})
}

const handleDelete = (id)=>{
const tempExpense =expenses.filter(item=>item.id !== id);
setExpenses(tempExpense);
handleAlert({type :'danger',text :'item deleted.'})
}

const handleEdit = (id) =>{
const expense = expenses.find(item => item.id === id);
let {charge ,amount} =expense;
setCharge(charge);
setAmount(amount);
setEdit(true);
setId(id);
}

  return (
    <>
    {alert.show &&  <Alert type = {alert.type} text ={alert.text}/>}
    <h1>budget calculator</h1>
    <main className='app'>
      <ExpenseForm
       handleSubmit={handleSubmit}
       charge={charge}
       handleCharge={handleCharge}
       amount={amount}
       handleAmount={handleAmount}
       edit ={edit}
      />
      <ExpenseList
       expenses={expenses}
       handleEdit ={handleEdit}
       handleDelete ={handleDelete}
       clearItems ={clearItems}
       />
    </main>
    <h1>
        total spending :
        <span className="total">
        <h1>
        total spending :
        <span className="total">
          $
          {expenses.reduce((acc, curr) => {
            return (acc +=parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
        </span>
      </h1>
    </>
  );
}

export default App;
