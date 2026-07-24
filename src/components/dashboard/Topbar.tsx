import UserMenu from "./UserMenu";

type TopbarProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export function Topbar({ user }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <h1 className="text-lg font-semibold">
        Dashboard
      </h1>
        <UserMenu user={user}/>
    </header>
  );
}