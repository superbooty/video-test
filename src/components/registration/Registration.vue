<template>
  <h2>Very exciting event with our pokemon expert, can you say Pikachu</h2>
  <div class="registration-form">
    <h3>Learn how to style your Pokemon apparel!</h3>
    <h2>Register For This Event</h2>
    <div class="separator"></div>
    <label>Email:</label>
    <input
      required
      type="email"
      ref="emailInput"
      name="email"
      v-model="userEmail"
      placeholder="Email Address"
    />
    <div class="separator"></div>
    <label>User Name:</label>
    <input
      type="text"
      ref="userNameInput"
      name="name"
      v-model="userName"
      pattern="[a-zA-Z0-9]{6,}"
      placeholder="User Name"
      @input="inputHandler"
    />
    <div class="separator"></div>
    <!-- <label>Password:</label>
    <input
      type="password"
      name="password"
      v-model="password"
      placeholder="Password"
    />
    <div class="separator"></div> -->
    <button type="button" v-on:click="validateAndRegister">
      Register
    </button>
  </div>
</template>

<script>
import { ref } from "vue";
import userState from "@/state/userState";

export default {
  name: "Login",
  setup() {
    const userName = ref(null);
    const userEmail = ref(null);
    const password = ref(null);
    const emailInput = ref(null);
    const userNameInput = ref(null);
    const { register } = userState();

    const validateAndRegister = () => {
      console.log("USER :: ", userName.value);
      const emailEl = emailInput.value;
      const userNameEl = userNameInput.value;
      if (emailEl.checkValidity()) {
        if (userNameEl.checkValidity()) {
          // call the state manager
          register(userName.value, userEmail.value);
        } else {
          console.error("UserName validation failed");
          userNameEl.setCustomValidity(
            "User Name must be at least 6 alphanumeric characters"
          );
          userNameEl.reportValidity();
        }
      } else {
        console.error("Email validation failed");
        emailEl.reportValidity();
      }
    };

    // method
    const inputHandler = () => {
        console.log("changed...");
        const userNameEl = userNameInput.value;
        userNameEl.setCustomValidity("");
    };

    return {
      register,
      userName,
      userEmail,
      password,
      emailInput,
      userNameInput,
      validateAndRegister,
      inputHandler
    };
  },
};
</script>

<style scoped lang="scss">
.registration-form {
  h2 {
    margin: 0 0 20px;
  }
  max-width: 500px;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  margin: auto;
  padding: 20px;
  .separator {
    height: 15px;
  }
  button {
    width: 50%;
    line-height: 36px;
    font-size: 16px;
    background: black;
    border: 1px solid;
    border-radius: 4px;
    color: white;
  }
  input {
    line-height: 24px;
    margin: 0 5px;
    border: none;
    border-bottom: 1px solid black;
    outline: none;
  }
  label {
    font-size: 14px;
    font-weight: 600;
    width: 80px;
    display: inline-block;
    text-align: right;
  }
}
</style>