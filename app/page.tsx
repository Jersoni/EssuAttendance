"use client"
import { useRouter } from 'next/navigation'


// eslint-disable-next-line @next/next/no-async-client-component
export default function Home() {


  const router = useRouter()

  const handleClick = () => {
    router.push("/attendance")
  }

  return (
    <div className="home">
      <div className="p-4 flex flex-col overflow-y-scroll h-[100vh] pb-40 pt-20">

        {/* ON GOING ATTENDANCE BLOCK */}
        <div className="ongoing-attendance mt-5">
          <h2 className="text-xl font-semibold">Ongoing Attendance</h2>
        
          <div className="border border-[#d0d0d0] bg-gray-100 h-fit rounded-md mt-5 p-3" onClick={handleClick}>
            <span className="event__title">Lorem Ipsum - Morning session</span>
            <div className="mt-2">
              <div>
                <span className="event__label">Venue</span>
                <span className="event__info">Covered court</span>
              </div>
              <div>
                <span className="event__label">Login time</span>
                <span className="event__info">8:00 AM</span>
              </div>
              <div>
                <span className="event__label">Logout time</span>
                <span className="event__info">12:00 PM</span>
              </div>
            </div>
          </div>

          <div className="border border-[#d0d0d0] bg-gray-100 h-fit rounded-md mt-5 p-3">
            <span className="event__title">Lorem Ipsum - Afternoon session</span>
            <div className="mt-2">
              <div>
                <span className="event__label">Venue</span>
                <span className="event__info">Covered court</span>
              </div>
              <div>
                <span className="event__label">Login time</span>
                <span className="event__info">1:00 PM</span>
              </div>
              <div>
                <span className="event__label">Logout time</span>
                <span className="event__info">4:00 PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* UPCOMING EVENTS BLOCK */}
        <div className="upcoming-events mt-16">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>

          <div className="border border-black border-opacity-20 bg-gray-100 h-fit rounded-md mt-5 p-3">
            <span className="event__title">Seminar</span>
            <div className="mt-2">
              <div>
                <span className="event__label">Venue</span>
                <span className="event__info">Covered court</span>
              </div>
              <div>
                <span className="event__label">Schedule</span>
                <span className="event__info">June 10, 2024</span>
              </div>
            </div>
          </div>

          <div className="border border-black border-opacity-20 bg-gray-100 h-fit rounded-md mt-5 p-3">
            <span className="event__title">Christmas Party</span>
            <div className="mt-2">
              <div>
                <span className="event__label">Venue</span>
                <span className="event__info">Covered court</span>
              </div>
              <div>
                <span className="event__label">Schedule</span>
                <span className="event__info">December 20, 2024</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
