export default function Footer() {
  return (
    <footer className="w-full py-4 bg-gray-100 text-center text-gray-600 text-sm">
      <p>
        &copy; {new Date().getFullYear()} Prepare Software Engineer Final Quiz. All rights reserved.
      </p>
    </footer>
  );
}