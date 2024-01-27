import { selectDeleteProjectPrompt, selectDeleteStagePrompt } from "@/store/app/app.selectors"
import { useAppSelector } from "./hooks"

const usePrompts = () => {
    const deleteStagePromptOpen = useAppSelector(selectDeleteStagePrompt);
    const deleteProjectPromptOpen = useAppSelector(selectDeleteProjectPrompt);
  return {
    deleteProjectPromptOpen,
    deleteStagePromptOpen
  }
}

export default usePrompts;