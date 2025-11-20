export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 text-gray-400 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-14">

        {/* TOP: Logo + description */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">

          {/* LOGO SECTION */}
          <div className="flex flex-col max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-linear-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12h18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M7 7v10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>

              <span className="bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-extrabold text-xl">
                TRIPGEN
              </span>
            </div>

            <p className="mt-4 text-gray-500 leading-relaxed">
             PLAN YOU NEXT TRIP WITH AI
            </p>
          </div>

          {/* LINKS SECTION */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 w-full md:w-auto">

            {/* PRODUCT */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">PRODUCT</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a className="hover:text-white transition" href="#">API</a></li>
                <li><a className="hover:text-white transition" href="#">Docs</a></li>
                <li><a className="hover:text-white transition" href="#">SDKs</a></li>
                <li><a className="hover:text-white transition" href="#">Pricing</a></li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">COMPANY</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a className="hover:text-white transition" href="#">About</a></li>
                <li><a className="hover:text-white transition" href="#">Careers</a></li>
                <li><a className="hover:text-white transition" href="#">Contact</a></li>
                <li><a className="hover:text-white transition" href="#">Blog</a></li>
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">LEGAL</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a className="hover:text-white transition" href="#">Terms</a></li>
                <li><a className="hover:text-white transition" href="#">Privacy</a></li>
                <li><a className="hover:text-white transition" href="#">Cookies</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* SOCIAL ICONS */}
        <div className="mt-14 flex gap-6">
          <a href="#" className="hover:text-white transition">
            <i className="fa-brands fa-github text-xl"></i>
          </a>
          <a href="#" className="hover:text-white transition">
            <i className="fa-brands fa-twitter text-xl"></i>
          </a>
          <a href="#" className="hover:text-white transition">
            <i className="fa-brands fa-discord text-xl"></i>
          </a>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-10 border-t border-white/5 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} TRIPGEN BY ANJUL. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
