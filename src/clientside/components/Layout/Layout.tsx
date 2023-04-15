import Image from "next/image";
import clsx from "clsx";
import type { LayoutProps } from "@/clientside/components/Layout/Layout.types";

const Layout: React.FC<LayoutProps> = (props) => {
  const { children, className, ...rest } = props;

  return (
    <main className="flex flex-col items-center 2xl:mt-[60px] mt-0 mx-auto max-w-[600px] p-10 box-border">
      <Image
        className="2xl:mb-16 mb-10 scale-75 2xl:scale-100"
        src="/logo.svg"
        alt="Joke of the day"
        width={400}
        height={126.3}
      />
      <div className={clsx(className)} {...rest}>
        {children}
      </div>
    </main>
  );
};

export default Layout;
