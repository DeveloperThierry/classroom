import { GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import Dashboard from "./pages/dashboard";
import { BookOpen, Building, GraduationCap, Home } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import SubjectsList from "./pages/subjects/list";
import SubjectsCreate from "./pages/subjects/create";
import ClassesList from "./pages/classes/list";
import ClassesCreate from "./pages/classes/create";
import {BACKEND_BASE_URL} from "./constants/index"
import ClassesShow from "./pages/classes/show";
import DepartmentsList from "./pages/departments/list";
import DepartmentsCreate from "./pages/departments/create";
function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "evv9AL-EQ1QCH-Pl0dHn",
              }}
              resources={[
                {
                  name:'dashboard', list:'/', meta:{label:'Home', icon:<Home/>}
                },
                {
                  name:'subjects', list:'/subjects', create: '/subjects/create',meta:{label:'Subjects', icon:<BookOpen/>}
                },
                {
                  name:'classes', list:'/classes', create: '/classes/create', show:'/classes/show/:id',meta:{label:'Classes', icon:<GraduationCap/>}
                },
                {
                  name:'departments', list:'/departments', create: '/departments/create',meta:{label:'Departments', icon:<Building/>}
                },
              ]}
            >
              <Routes>
                <Route element={<Layout><Outlet/></Layout>}>
                <Route path="/" element={<Dashboard/>} />
                <Route path='subjects'>
                  <Route index element={<SubjectsList/>}/>
                  <Route path='create' element={<SubjectsCreate/>}/>
                </Route>
                <Route path='classes'>
                  <Route index element={<ClassesList/>}/>
                  <Route path='create' element={<ClassesCreate/>}/>
                  <Route path='show/:id' element={<ClassesShow/>}/>
                </Route>
                <Route path='departments'>
                  <Route index element={<DepartmentsList/>}/>
                  <Route path='create' element={<DepartmentsCreate/>}/>
                </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
