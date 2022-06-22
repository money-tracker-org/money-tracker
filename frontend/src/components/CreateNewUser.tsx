import { HTMLAttributes, useState } from "react";
import { UserDTO } from "../../../shared/dto/userDTO";

export default function CreateNewUser() {
  const [inputForm, setFormInfo] = useState({
    firstName: "",
    lastName: "",
  });
  const handleKeyPress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInfo({ ...inputForm, [e.target.name]: e.target.value });
  };

  async function PostUser() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputForm),
    };
    console.log(requestOptions.body);
    console.log("Big city life");
    const response = await fetch("http://localhost:3001/user", requestOptions);
  }
  return (
    <>
      <div>
        <input
          type="text"
          name="firstName"
          placeholder="First name"
          value={inputForm.firstName}
          onChange={handleKeyPress}
        />
      </div>
      <input
        type="text"
        name="lastName"
        placeholder="Last name"
        value={inputForm.lastName}
        onChange={handleKeyPress}
      />
      <button onClick={PostUser}> Create New User </button>
    </>
  );
}
