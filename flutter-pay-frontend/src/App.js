import React, {useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [error, setError] = useState(null);

  const makePaymentCall = async ({fullname, email, phonenumber}) => {
    const response = await axios.post(
      'http://localhost:5500/payment/create',

      {fullname, email, phonenumber}
    );

    return response.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fullname && email && phonenumber) {
      const result = await makePaymentCall({
        fullname: fullname,
        email: email,
        phonenumber: phonenumber,
      });
      if (result.response.status === 'success') {
        return (window.location.href = result.response.data.link);
      } else {
        setError(result.response.message);
      }
    }
  };

  const handleName = (e) => setFullname(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePhone = (e) => setPhonenumber(e.target.value);

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h1>Make payment with flutterwave</h1>
        <input
          type="text"
          placeholder="enter fullname"
          onChange={handleName}
          value={fullname}
        />
        <input
          type="text"
          placeholder="enter email"
          onChange={handleEmail}
          value={email}
        />
        <input
          type="tel"
          placeholder="enter phone number"
          onChange={handlePhone}
          value={phonenumber}
        />
        <p style={{color: 'red', fontSize: '1.2rem'}}>{error && error}</p>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
