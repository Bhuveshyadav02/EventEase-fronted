const storedUser = localStorage.getItem('user');
const storedUserType = localStorage.getItem("userType");
const jwtToken = localStorage.getItem("jwttoken");

export const initialState = jwtToken ? { user: JSON.parse(storedUser), userType: storedUserType } : { user: null, userType: null };

export const reducers = (state, action) => {
  switch (action.type) {
    case "USER":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload };

    case "USERTYPE":
      localStorage.setItem("userType", action.payload); // No need to stringify for a string
      return { ...state, userType: action.payload };

    default:
      return state;
  }
};
