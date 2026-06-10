import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'raw_document_texts' })
export class RawDocumentText {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'file_name', type: 'text' })
  fileName: string;

  @Column({ name: 's3_key', type: 'text' })
  s3Key: string;

  @Column({ name: 'extracted_text', type: 'text' })
  extractedText: string;

  @Column({ name: 'line_count', type: 'int' })
  lineCount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}