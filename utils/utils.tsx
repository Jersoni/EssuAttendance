import supabase from '@/lib/supabaseClient';
import { AuthProps } from '@/types';
import crypto from 'crypto';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from 'next/navigation';

export function downloadImage(
  imageUrl: string, 
  filename: string, 
  setLoading: (loading: boolean) => void
) {
  // console.log('processing download')
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

export function getTimeOfDay(timeString: string) {
  // Validate the format using a regex
  const timeFormat = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  if (!timeFormat.test(timeString)) {
      return "Invalid time format";
  }

  // Extract hours from the string
  const [hours] = timeString.split(":").map(Number);

  // Determine the time of day
  if (hours >= 0 && hours < 12) {
      return "Morning";
  } else if (hours >= 12 && hours < 18) {
      return "Afternoon";
  } else {
      return "Nighttime";
  }
}

export function getFormattedTime(now: Date) {
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours || 12; // If hours is 0, set it to 12
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${formattedMinutes} ${ampm}`;
}

/*
* redirects user to homepage if logged in
* if user is logged in, returns name, code, role, and signout function
* else redirects user to login page
*/

export function checkAuth(router: AppRouterInstance, pathname: string) { // returns ID and role

  let authToken = localStorage.getItem("presenxiaAuthToken")

  if (authToken) {

    if (pathname === "/auth") {
      router.push("/")
    }

    return {
      id: Number(authToken.slice(0, authToken.indexOf('.'))),
      role: authToken.slice(authToken.indexOf('.')+1)
    } as AuthProps;

  } else {
    if (pathname !== "/signup") {
      router.push("/auth")
    }
  }
}

export async function fetchOrganization(id: number) {
  // console.log(id)
  try {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", id)
      .single()

    // console.log("process")

    if (error) {
      console.error(error);
    } else {
      console.log(data)
      return data as AuthProps;
    }
  } catch (err) {
    console.error(err);
  }
}

// export function signout(router: AppRouterInstance) {
//   localStorage.removeItem("presenxiaAuthToken")
// }

export async function hashString(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}


// (async () => {
//   try {
//     const { data, error } = await supabase
//       .from("")
//       .select()
//   } catch (err) {
//     console.error(err);
//   }
// })();