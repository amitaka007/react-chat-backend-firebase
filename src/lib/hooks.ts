import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux"; 
import { AppDispatch, RootState } from "../store/store";

// Typed Dispatch Hook
export const useAppDispatch: () => AppDispatch = useDispatch;
// Typed Selector Hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
