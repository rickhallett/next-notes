
import { Command } from "commander";
import {
  createPointsAction,
  deletePointsAction,
  getPointsByUserIdAction,
  getAllPointsAction,
  updatePointsAction,
  incrementPointsAction,
} from "../actions/points-actions";

const program = new Command();

program
  .name("points-cli")
  .description("CLI to manage points system")
  .version("1.0.0");

program
  .command("create")
  .description("Create points entry for a user")
  .requiredOption("-u, --userId <string>", "User ID")
  .option("-p, --points <number>", "Initial points", "0")
  .action(async (options) => {
    const result = await createPointsAction({
      userId: options.userId,
      points: parseInt(options.points),
    });
    console.log(result);
  });

program
  .command("get")
  .description("Get points for a user")
  .requiredOption("-u, --userId <string>", "User ID")
  .action(async (options) => {
    const result = await getPointsByUserIdAction(options.userId);
    console.log(result);
  });

program
  .command("list")
  .description("List all points entries")
  .action(async () => {
    const result = await getAllPointsAction();
    console.log(result);
  });

program
  .command("update")
  .description("Update points for a user")
  .requiredOption("-u, --userId <string>", "User ID")
  .requiredOption("-p, --points <number>", "New points value")
  .action(async (options) => {
    const result = await updatePointsAction(options.userId, {
      points: parseInt(options.points),
    });
    console.log(result);
  });

program
  .command("increment")
  .description("Increment points for a user")
  .requiredOption("-u, --userId <string>", "User ID")
  .requiredOption("-a, --amount <number>", "Amount to increment")
  .action(async (options) => {
    const result = await incrementPointsAction(
      options.userId,
      parseInt(options.amount)
    );
    console.log(result);
  });

program
  .command("delete")
  .description("Delete points entry for a user")
  .requiredOption("-u, --userId <string>", "User ID")
  .action(async (options) => {
    const result = await deletePointsAction(options.userId);
    console.log(result);
  });

program.parse();
