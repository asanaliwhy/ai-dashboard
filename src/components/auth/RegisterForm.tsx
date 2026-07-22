"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterSchema } from "@/lib/validations";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export function RegisterForm(){
    const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    }
});
  
 async function onSubmit(values: RegisterSchema){
    const response = await fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(values),
    })
    const data = await response.json();
    if (!response.ok) {
            if (data.error === "Email already exists" || response.status === 409) {
                form.setError("email", {
                    type: "server",
                    message: "Email already exists"
                });
            } else{
                form.setError("root", {
                    message: data.error || "Что-то пошло не так"
                });
            }
            return;
        }
    form.reset();
    console.log(data);
 }

 return (
    <Form {...form}>
        <form className="space-y-4 w-full max-w-md" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} autoComplete="name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} autoComplete = "email" onChange={(e)=>{
                    field.onChange(e);
                    form.clearErrors("email");
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
                  <Input placeholder="Password" type="password" {...field} autoComplete="new-password"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="Confirm Password" type="password" {...field} autoComplete="new-password"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root && (
            <p className="text-sm font-medium text-red-500">{form.formState.errors.root.message}</p>
          )}
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
    </Form>
 )
}