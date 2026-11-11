import { Action, ActionPanel, Alert, Icon, Keyboard, List, Toast, confirmAlert, showToast } from "@raycast/api";
import { showFailureToast, useCachedPromise } from "@raycast/utils";
import { deleteProject, myProjects } from "./api";
import { ProjectForm } from "./components/ProjectForm";
import { ProjectCopyActions, ProjectListItem, ProjectOpenActions } from "./components/ProjectListItem";
import { Project } from "./types";

export default function Command() {
  const { data: projects, isLoading, revalidate, mutate } = useCachedPromise(myProjects);

  async function remove(project: Project) {
    const confirmed = await confirmAlert({
      title: `Remove ${project.name}?`,
      message: "It disappears from your profile and the directory. This can't be undone.",
      icon: Icon.Trash,
      primaryAction: { title: "Remove", style: Alert.ActionStyle.Destructive },
    });
    if (!confirmed) return;

    try {
      await mutate(deleteProject(project.id), {
        optimisticUpdate: (current) => current?.filter((other) => other.id !== project.id),
      });
      await showToast({ style: Toast.Style.Success, title: "Project removed" });
    } catch (error) {
      await showFailureToast(error, { title: "Couldn't remove project" });
    }
  }

  const addProject = (
    <Action.Push
      title="Add Project"
      icon={Icon.Plus}
      shortcut={Keyboard.Shortcut.Common.New}
      target={<ProjectForm onSave={revalidate} />}
    />
  );

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Filter your projects…">
      <List.EmptyView
        icon={Icon.AppWindow}
        title="No projects yet"
        description="Add the first project to your Build in Public profile."
        actions={<ActionPanel>{addProject}</ActionPanel>}
      />
      {projects?.map((project) => (
        <ProjectListItem
          key={project.id}
          project={project}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <ProjectOpenActions project={project} />
              </ActionPanel.Section>
              <ActionPanel.Section>
                <Action.Push
                  title="Edit Project"
                  icon={Icon.Pencil}
                  shortcut={Keyboard.Shortcut.Common.Edit}
                  target={<ProjectForm project={project} onSave={revalidate} />}
                />
                {addProject}
                <ProjectCopyActions project={project} />
                <Action
                  title="Reload"
                  icon={Icon.ArrowClockwise}
                  shortcut={Keyboard.Shortcut.Common.Refresh}
                  onAction={revalidate}
                />
              </ActionPanel.Section>
              <ActionPanel.Section>
                <Action
                  title="Remove Project"
                  icon={Icon.Trash}
                  style={Action.Style.Destructive}
                  shortcut={Keyboard.Shortcut.Common.Remove}
                  onAction={() => remove(project)}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
