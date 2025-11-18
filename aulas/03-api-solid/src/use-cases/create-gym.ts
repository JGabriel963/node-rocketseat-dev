import { Gym, User } from "@prisma/client";
import { GymsRepository } from "@/respositories/gyms-repository";

interface CreateGymCaseRequest {
  title: string;
  description?: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface RegisterUseCaseResponse {
  gym: Gym;
}

export class CreateGymCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymCaseRequest): Promise<RegisterUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description: description ?? null,
      phone,
      latitude,
      longitude,
    });

    return { gym };
  }
}
