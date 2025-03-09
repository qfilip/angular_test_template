import { Project } from "../home/home.models";

export type AppInfoDialogResult = {
    proceed: boolean;
    project: Project;
    dontShowAgain: boolean;
}