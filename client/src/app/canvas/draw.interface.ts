export interface DrawAction {
  prevPos: { x: number; y: number };
  currentPos: { x: number; y: number };
}

export interface RemoteDrawAction extends DrawAction {
    id: string,
}
