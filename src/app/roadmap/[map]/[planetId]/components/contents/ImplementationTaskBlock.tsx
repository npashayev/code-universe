import { ImplementationTaskContent } from "@/lib/types/planet";

interface Props {
    content: ImplementationTaskContent;
}

const ImplementationTaskBlock = ({ content }: Props) => {
    return (
        <div>
            <h3>Implementation task</h3>
            <p className="whitespace-pre-wrap">{content.task}</p>
        </div>
    )
}

export default ImplementationTaskBlock