import ToolContent from "./ToolContent";
import { getToolBySlug } from "../../sanity/utils";

export default async function ToolPage({ params }) {
  const tool = await getToolBySlug(params.slug);

  if (!tool) {
    return <div>Tool not found</div>;
  }

  return <ToolContent tool={tool} />;
}
