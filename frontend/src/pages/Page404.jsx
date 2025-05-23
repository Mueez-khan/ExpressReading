

export default function Page404() {
  return (
    <div>
      

      <div className="w-full h-full ">


        {/* <h1 className="font-bold text-8xl italic"><span className="text-red-600">404 </span>Page not found</h1> */}

        <section className="bg-gray-900  w-full h-screen ">
    <div className="py-8 px-4 mx-auto  lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
            <h1 className=" text-7xl  tracking-tight font-extrabold lg:text-9xl text-white">404</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl text-white">Page not found currently</p>
            <p className="mb-4 text-lg font-light text-gray-300">Sorry, we can't find such page.</p>

          <button type="button" className="text-white  bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-1 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
          <a href="/">Back To Home</a>
          </button>
        </div>   
    </div>
</section>
      </div>


    </div>
  )
}
