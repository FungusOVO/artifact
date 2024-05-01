import { POrder } from "@/game/base/sort/porder";
import { ArtifactData } from "@/game/gs/data";

export class GsPOrder extends POrder {
    game = "gs";
    ArtifactData = ArtifactData;
    orderSize = 5;
}
