import { AuthProps } from "@/types";
import crypto from 'crypto';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function downloadImage(
  imageUrl: string, 
  filename: string, 
  setLoading: (loading: boolean) => void
) {
  console.log('processing download')
  setLoading(true)

  fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); 

      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url); 
    }).finally(() => {
        setLoading(false)
    });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
}


/*
* redirects user to homepage if logged in
* if user is logged in, returns name, code, role, and signout function
* else redirects user to login page
*/
export function checkAuth(router: AppRouterInstance, onLogin = false) {
  let now = new Date()
  let authToken = localStorage.getItem("authToken")
  const signout = () => {
    localStorage.removeItem("authToken")
    router.push("/auth")
  }
  
  if (authToken) {
    if (onLogin) {
      router.push("/")
    }

    const { org_id, name, value, expiry } : { org_id: number, name: string, value: string, expiry: number } = authToken 
      ? JSON.parse(authToken)
      : {value: "", expiry: 0}
  
    if (now.getTime() > expiry) {
      localStorage.removeItem("authToken")
      router.push("/auth")
    }

    return JSON.parse(authToken).value === ""
      ? {
        org_id: org_id,
        name: name,
        code: value, 
        role: "student",
        signout: signout,
      } as AuthProps
      : { 
        org_id: org_id,
        name: name, 
        code: value, 
        role: "admin", 
        signout: signout,
      } as AuthProps 

  } else {
    router.push("/auth")
  }
}

export async function hashString(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}