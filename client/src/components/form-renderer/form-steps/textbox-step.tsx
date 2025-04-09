import { useState, useEffect } from "react";
import { useFormContext } from "@/contexts/form-context";
import { TextboxStep as TextboxStepType } from "@shared/types";
import { Textarea } from "@/components/ui/textarea";

interface TextboxStepProps {
  step: TextboxStepType;
}

export default function TextboxStep({ step }: TextboxStepProps) {
  const { updateResponse, formResponses } = useFormContext();
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Get the current response for this step if it exists
  useEffect(() => {
    const savedResponse = formResponses[step.title];
    if (savedResponse) {
      setValue(savedResponse);
    }
  }, [formResponses, step.title]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Validate if required
    if (step.validation?.required && !newValue.trim()) {
      setError('This field is required');
    } else if (step.validation?.minLength && newValue.length < step.validation.minLength) {
      setError(`Please enter at least ${step.validation.minLength} characters`);
    } else {
      setError(null);
    }
    
    updateResponse(step.title, newValue);
  };

  return (
    <div className="flex-1 flex flex-col py-4">
      <h3 className="text-2xl font-bold mb-2 text-center">{step.title}</h3>
      <p className="text-gray-500 mb-5 text-center">{step.subtitle}</p>
      
      <div className="w-full mb-4">
        <Textarea
          placeholder={step.placeholder}
          rows={step.rows}
          value={value}
          onChange={handleTextChange}
          className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
        
        {step.validation?.minLength && (
          <p className="mt-2 text-xs text-gray-500">
            {value.length}/{step.validation.minLength} characters minimum
          </p>
        )}
      </div>
    </div>
  );
}
