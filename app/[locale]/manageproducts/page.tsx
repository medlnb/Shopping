import Table from "./Table";

function Page({ searchParams: { p } }: { searchParams: { p?: number } }) {
  return <Table page={p ?? 1} />;
}

export default Page;
