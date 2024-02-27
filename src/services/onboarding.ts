import { TransactionBaseService } from "@medusajs/medusa";
import OnboardingRepository from "../repositories/onboarding";
import { OnboardingState } from "../models/onboarding";
import { EntityManager, IsNull, Not } from "typeorm";
import { UpdateOnboardingStateInput } from "../types/onboarding";

type InjectedDependencies = {
  manager: EntityManager;
  onboardingRepository: typeof OnboardingRepository;
};

class OnboardingService extends TransactionBaseService {
  protected onboardingRepository_: typeof OnboardingRepository;

  constructor({ onboardingRepository }: InjectedDependencies) {
    super(arguments[0]);

    this.onboardingRepository_ = onboardingRepository;
  }

  async retrieve(): Promise<OnboardingState | null> {
    const onboardingRepo = this.activeManager_.withRepository(
      this.onboardingRepository_
    );

    const status = await onboardingRepo.findOne({
      where: { id: Not(IsNull()) },
    });

    return status;
  }

  async update(data: UpdateOnboardingStateInput): Promise<OnboardingState | null> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const onboardingRepository = transactionManager.withRepository(
          this.onboardingRepository_
        );

        const status = await this.retrieve();

        for (const [key, value] of Object.entries(data)) {
          if(status !== null && key in status)
          status[key] = value;
        }
        if(status)
        return await onboardingRepository.save(status);
        else return null
      }
    );
  }
}

export default OnboardingService;
