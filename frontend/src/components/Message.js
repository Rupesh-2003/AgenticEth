import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Message = ({ content, isAI }) => {
  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4`}>
      <div className={`flex ${isAI ? "flex-row" : "flex-row-reverse"} items-start max-w-3/4`}>
        <Avatar className="w-8 h-8 mr-2">
          <AvatarImage src={isAI ? "/ai-avatar.png" : "/human-avatar.png"} />
          <AvatarFallback>{isAI ? "AI" : "You"}</AvatarFallback>
        </Avatar>
        <div className={`rounded-lg p-3 ${isAI ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-900"}`}>
          {content}
        </div>
      </div>
    </div>
  )
}

export default Message

