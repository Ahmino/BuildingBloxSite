export default function Footer({ admin }: { admin?: boolean }) {
  return (
    <footer className="py-8 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} BuildingBlox.{" "}
      {admin ? "Admin Panel" : "All rights reserved."}
    </footer>
  );
}
