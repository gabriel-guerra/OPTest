# OPTest
Test framework for IBM OpenPages

## Local installation
1. Clone this repository
2. Create a `.env` file in the folder `/OPTest` following the model in `.env_file_model.txt`
3. Open a command terminal in `/OPTest` location 
4. Run the command `pip install .`
5. Create test cases in `/OPTest/test` starting with the name pattern `test_[...].py`
6. To run all tests, access location `/OPTest/test` and run the following command:
   * For Windows: `python -m unittest`
   * For Linux: `python3 -m unittest`