"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginSchema } from "@/lib/loginValidation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function LoginForm(){
    const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
        email: "",
        password: "",
    }
});
  

  async function onSubmit(values: LoginSchema){
      const response = await fetch("/api/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(values),
      })
      const data = await response.json();
      if (!response.ok) {
              if (response.status === 401) {
                  form.setError("root", {
                      message: "Invalid email or password",
                  });
                  return;
              } 
              else{
                form.setError("root", {
                message: data.error || "Something went wrong",
                });
                return;
              }
           
          }
      form.reset();
      console.log(data);
   }

   return (
    <Form {...form}>
        <form className="space-y-4 w-full max-w-md" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} autoComplete = "email" onChange={(e)=>{
                    field.onChange(e);
                    form.clearErrors("root");
                  }}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} autoComplete="current-password" onChange={(e) => {
                      field.onChange(e);
                      form.clearErrors("root");
                    }}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root && (
            <p className="text-sm font-medium text-red-500">{form.formState.errors.root.message}</p>
          )}
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
    </Form>
 )}



