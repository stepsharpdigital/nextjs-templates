"use server";
import { auth } from "@/lib/auth";

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (err) {
    const e = err as Error;
   
    const errorMessage = e.message.toLowerCase();
    
    if (errorMessage.includes("invalid") || 
        errorMessage.includes("credentials") || 
        errorMessage.includes("password") ||
        errorMessage.includes("email")) {
      return {
        success: false,
        message: "Invalid email or password. Please check your credentials and try again.",
      };
    }
    

    return {
      success: false,
      message: e.message || "An unknown error occurred. Please try again.",
    };
  }
};

export const signUp = async (username: string, email: string, password: string) => {
  try{
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: username,
      },
    });
    return{
      success: true,
      message: "Account created successfully. Please check your email to verify your account."
    }
  } catch(err){
     const e = err as Error;
     const errorMessage = e.message.toLowerCase();
     

     if (errorMessage.includes("already exists") || 
         errorMessage.includes("duplicate") || 
         errorMessage.includes("already registered") ||
         errorMessage.includes("taken")) {
       return {
         success: false,
         message: "This email is already registered. Please try logging in or use a different email.",
       };
     }
     
     
     if (errorMessage.includes("invalid email") || 
         errorMessage.includes("email format") ||
         errorMessage.includes("email")) {
       return {
         success: false,
         message: "Please enter a valid email address.",
       };
     }
     
     return {
       success: false,
       message: "Unable to create account. Please try again with valid information.",
     };
  }
};