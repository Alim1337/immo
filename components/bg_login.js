import Image from "next/image";

const BgLogin = () => {
  return (
    <div className="fixed top-0 left-0 z-[-1] w-full h-full">
      <Image
        src="https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80"
        layout="fill"
        objectFit="cover"
        alt="background"
      />
    </div>
  );
};

export default BgLogin;
