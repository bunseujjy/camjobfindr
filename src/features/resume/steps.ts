import Download from "./db/component/Download";
import Education from "./db/component/Education";
import GeneralForm from "./db/component/GeneralForm";
import PersonalInfo from "./db/component/PersonalInfo";
import Skills from "./db/component/Skills";
import Summary from "./db/component/Summary";
import WorkExperience from "./db/component/WorkExperience";
import { EditorFormType } from "./type/resumeType";

export const steps: {
    title: string;
    component: React.ComponentType<EditorFormType>;
    key: string;
}[] = [
    {title: 'General Info', component: GeneralForm, key: "general-info"},
    {title: 'Personal Info', component: PersonalInfo, key: "personal-info"},
    {title: 'Work Experience', component: WorkExperience, key: "work-experience"},
    {title: 'Education', component: Education, key: "education"},
    {title: 'Skills', component: Skills, key: "skills"},
    {title: 'Summary', component: Summary, key: "summary"},
    {title: 'Download Resume', component: Download, key: "download"},
]