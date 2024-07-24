import Image from "next/image"
import Link from "next/link"

const page = () => {
  return (
    <div className={`overflow-y-scroll p-4 pt-[4.5rem] pb-40 flex flex-col h-[100vh]`}>

      <div className="flex flex-col gap-4">

        <Link href={'/notfound'} className="flex flex-col gap-3 relative overflow-hidden bg-teal-700 text-white rounded-2xl h-fit p-5 !pb-20">
          <span className="text-lg font-medium">Our Mission & Values</span>
          <span className="font-light opacity-90 text-sm">Make attendance management more efficient and stress-free for all.</span>
          <span className="font-medium">Read more {'>'}</span>
          <Image
            src={'/images/rocketship.png'}
            alt={'rocketship'}
            height={250}
            width={230}
            className="absolute right-2 translate-y-16"
          />
        </Link>
        
        <Link href={'/notfound'} className="flex flex-col gap-3 relative overflow-hidden bg-orange-200 rounded-2xl h-fit p-5 !pb-20">
          <span className="text-lg font-medium">Privacy & Security</span>
          <span className="font-light opacity-90 text-sm">Learn about our commitment to transparency and data security.</span>
          <span className="font-medium">Read more {'>'}</span>
          <Image
            src={'/images/safe.png'}
            alt={'rocketship'}
            height={250}
            width={250}
            className="absolute translate-y-3 right-0"
          />
        </Link>

        <Link href={'/notfound'} className="flex flex-col gap-3 relative overflow-hidden bg-slate-200 rounded-2xl h-fit p-5 !pb-20">
          <span className="text-lg font-medium">FAQs</span>
          <span className="font-light opacity-90 text-sm">Get quick answers to your most common questions.</span>
          <span className="font-medium">Read more {'>'}</span>
          <Image
            src={'/images/faq.png'}
            alt={'rocketship'}
            height={280}
            width={240}
            className="absolute right-2 translate-y-16"
          />
        </Link>

        <Link href={'/notfound'} className="flex flex-col gap-3 relative overflow-hidden bg-red-200 rounded-2xl h-fit p-5 !pb-20">
          <span className="text-lg font-medium">Help & Support</span>
          <span className="font-light opacity-90 text-sm">Encountering problems? Our support team is ready to assist.</span>
          <span className="font-medium">Contact us {'>'}</span>
          <Image
            src={'/images/callcenter.png'}
            alt={'rocketship'}
            height={250}
            width={250}
            className="absolute right-0 translate-y-16"
          />
        </Link>

        <div className="mt-4 flex flex-col gap-1">
          <span className="text-sm font-medium">App version 1.0.0</span>
          <span className="text-sm opacity-90">SSC - ESSU Guiuan</span>
          <span className="text-sm opacity-90">&copy; 2024 Jerson Caibog & Rhey Ranido</span>
        </div>

      </div>
    </div>
  )
}

export default page