import React from 'react';

const UploadForm = (props) => {
  
  return (
    <div class="eureka__upload-form">
      <form>
          <label htmlFor="eureka__upload-form">Upload Files<span class="visually-hidden"> to {props.content.cd}</span>:&ensp;</label>
          <input id="eureka__upload-form" multiple="multiple" name="uploadFiles" type="file" />
      </form>
    </div>
  );
}

export default UploadForm;

