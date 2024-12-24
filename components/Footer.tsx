import { CiLocationOn, CiMail } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { SlSocialFacebook } from "react-icons/sl";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import Link from "next/link";

function Footer() {
  return (
    <footer className="flex justify-between flex-col md:flex-row flex-wrap gap-4 mx-auto max-w-[73rem] py-20 p-2">
      <section>
        <h1 className="text-xl font-bold mb-4">Acount</h1>
        <ul className="text-gray-600">
          <li className="mb-2 hover:text-[#386cf8] duration-150">
            <Link href="">Log in / Sign up</Link>
          </li>
          <li className="mb-2 hover:text-[#386cf8] duration-150">
            <Link href="/cart"> Cart</Link>
          </li>
          <li className="mb-2 hover:text-[#386cf8] duration-150">
            <Link href="/products">Shop</Link>
          </li>
        </ul>
      </section>
      <section>
        <h1 className="text-xl font-bold mb-4">Help & Support</h1>
        <ul>
          <li className="flex items-center gap-2 mb-2 ">
            <CiLocationOn fill="#386cf8" />
            <p className="text-gray-600">
              685 Market Street,Las Vegas, LA 95820,United States.
            </p>
          </li>
          <li className="flex items-center gap-2 mb-2 ">
            <BsTelephone fill="#386cf8" />
            <p className="text-gray-600">(+965) 7492-3477</p>
          </li>
          <li className="flex items-center gap-2 mb-2 ">
            <CiMail fill="#386cf8" />
            <p className="text-gray-600">support@example.com</p>
          </li>
        </ul>
        <div className="flex items-center gap-2 mt-4 text-gray-600 text-lg">
          <SlSocialFacebook className="cursor-pointer hover:scale-110 duration-150" />
          <FaXTwitter className="cursor-pointer hover:scale-110 duration-150" />
          <FaInstagram className="cursor-pointer hover:scale-110 duration-150" />
          <CiLinkedin
            className="cursor-pointer hover:scale-110 duration-150"
            size={20}
          />
        </div>
      </section>
      <section>
        <h1 className="text-xl font-bold mb-4">Quick Link</h1>
        <ul className="text-gray-600">
          <li className="mb-2 hover:text-[#386cf8] duration-150">
            <Link href="">Privacy Policy</Link>
          </li>
          <li className="mb-2 hover:text-[#386cf8] duration-150">
            <Link href=""> Refund Policy</Link>
          </li>
          <li className="mb-2 hover:text-[#386cf8] duration-150">
            <Link href="">Terms of Use</Link>
          </li>
          <li className="mb-2 hover:text-[#386cf8] duration-150">
            <Link href="">Contact</Link>
          </li>
        </ul>
      </section>
    </footer>
  );
}

export default Footer;
