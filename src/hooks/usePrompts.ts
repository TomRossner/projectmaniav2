import { selectDeleteProjectPrompt, selectDeleteStagePrompt, selectDeleteTaskPrompt } from "@/store/app/app.selectors"
import { useAppSelector } from "./hooks"

const usePrompts = () => {
    const deleteStagePromptOpen = useAppSelector(selectDeleteStagePrompt);
    const deleteProjectPromptOpen = useAppSelector(selectDeleteProjectPrompt);
    const deleteTaskPromptOpen = useAppSelector(selectDeleteTaskPrompt);

  return {
    deleteProjectPromptOpen,
    deleteStagePromptOpen,
    deleteTaskPromptOpen
  }
}

export default usePrompts;